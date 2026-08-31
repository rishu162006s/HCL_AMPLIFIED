import {
  createLearningPath,
  createLearningStep,
  deleteLearningPath,
  deleteLearningStep,
  findLearningPathById,
  findLearningPathsByUserId,
  findLearningStepById,
  findLearningStepByPathAndResource,
  findMaxStepOrder,
  updateLearningPath,
  updateLearningStepOrder,
  findLearningPathByGoalId,
} from "../repositories/learningPath.repository";

import {
  findGoalById,
} from "../repositories/goal.repository";

import {
  findResourceById,
} from "../repositories/resource.repository";

import {
  generateLearningPathWithAI,
} from "./LearningPathAI.service";

// ==================================================
// CREATE NORMAL LEARNING PATH
// ==================================================

export const createNewLearningPath = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    goalId?: string;
  }
) => {
  // ------------------------------------------------
  // VERIFY GOAL
  // ------------------------------------------------

  if (data.goalId) {
    const goal =
      await findGoalById(
        data.goalId
      );

    if (!goal) {
      throw new Error(
        "GOAL_NOT_FOUND"
      );
    }

    if (
      goal.userId !==
      userId
    ) {
      throw new Error(
        "UNAUTHORIZED_GOAL_ACCESS"
      );
    }
  }

  // ------------------------------------------------
  // CREATE PATH
  // ------------------------------------------------

  return createLearningPath({
    userId,

    title:
      data.title.trim(),

    description:
      data.description?.trim(),

    goalId:
      data.goalId,
  });
};

// ==================================================
// GENERATE AI LEARNING PATH
// ==================================================

export const generateNewLearningPath = async (
  userId: string,
  goalId: string
) => {
  // ------------------------------------------------
  // VERIFY GOAL
  // ------------------------------------------------

  const goal =
    await findGoalById(
      goalId
    );

  if (!goal) {
    throw new Error(
      "GOAL_NOT_FOUND"
    );
  }

  if (
    goal.userId !==
    userId
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  // ------------------------------------------------
  // RETURN EXISTING PATH IF ALREADY GENERATED
  // ------------------------------------------------

  const existingPath =
    await findLearningPathByGoalId(
      goalId,
      userId
    );

  if (existingPath) {
    return existingPath;
  }

  // ------------------------------------------------
  // GENERATE PATH USING AI
  // ------------------------------------------------

  const result =
    await generateLearningPathWithAI(
      goalId,
      userId
    );

  const aiPath =
    result.learningPath;

  // ------------------------------------------------
  // CREATE LEARNING PATH
  // ------------------------------------------------

  const learningPath =
    await createLearningPath({
      userId,

      goalId,

      title:
        aiPath.title,

      description:
        aiPath.description,
    });

  try {
    let order = 1;
    let stepsCreated = 0;

    // ------------------------------------------------
    // PROCESS FINAL AI PHASES
    // ------------------------------------------------

    for (
      const phase of
        aiPath.phases
    ) {
      for (
        const aiTopic of
          phase.topics
      ) {
        // --------------------------------------------
        // FIND EXACT DATABASE TOPIC
        // --------------------------------------------

        const topic =
          result.topics.find(
            (item) =>
              item.id ===
              aiTopic.topicId
          );

        if (!topic) {
          throw new Error(
            "AI_INVALID_LEARNING_PATH"
          );
        }

        // --------------------------------------------
        // VERIFY TOPIC NAME
        // --------------------------------------------

        if (
          topic.name.trim() !==
          aiTopic.name.trim()
        ) {
          throw new Error(
            "AI_INVALID_LEARNING_PATH"
          );
        }

        // --------------------------------------------
        // GET RESOURCES
        // --------------------------------------------

        const resources =
          topic.resources;

        if (
          resources.length ===
          0
        ) {
          throw new Error(
            "PREREQUISITE_HAS_NO_RESOURCE"
          );
        }

        // --------------------------------------------
        // CREATE STEP FOR EACH RESOURCE
        // --------------------------------------------

        for (
          const topicResource of
            resources
        ) {
          const resource =
            topicResource.resource;

          // ------------------------------------------
          // DUPLICATE PROTECTION
          // ------------------------------------------

          const existing =
            await findLearningStepByPathAndResource(
              learningPath.id,
              resource.id
            );

          if (existing) {
            continue;
          }

          // ------------------------------------------
          // CREATE LEARNING STEP
          // ------------------------------------------

          await createLearningStep({
            learningPathId:
              learningPath.id,

            resourceId:
              resource.id,

            order,

            milestone:
              `Phase ${phase.phaseNumber}: ${phase.title} — ${topic.name}`,
          });

          order++;
          stepsCreated++;
        }
      }
    }

    // ------------------------------------------------
    // PREVENT EMPTY PATH
    // ------------------------------------------------

    if (
      stepsCreated ===
      0
    ) {
      throw new Error(
        "AI_GENERATED_NO_LEARNING_STEPS"
      );
    }

    // ------------------------------------------------
    // RETURN COMPLETE PATH
    // ------------------------------------------------

    const completePath =
      await findLearningPathById(
        learningPath.id
      );

    if (!completePath) {
      throw new Error(
        "LEARNING_PATH_NOT_FOUND"
      );
    }

    return completePath;

  } catch (error) {
    // ------------------------------------------------
    // ROLLBACK
    // ------------------------------------------------

    try {
      await deleteLearningPath(
        learningPath.id
      );
    } catch (
      deleteError
    ) {
      console.error(
        "Failed to rollback learning path:",
        deleteError
      );
    }

    throw error;
  }
};

// ==================================================
// GET MY LEARNING PATHS
// ==================================================

export const getMyLearningPaths = async (
  userId: string
) => {
  return findLearningPathsByUserId(
    userId
  );
};

// ==================================================
// GET ONE LEARNING PATH
// ==================================================

export const getMyLearningPath = async (
  userId: string,
  learningPathId: string
) => {
  const learningPath =
    await findLearningPathById(
      learningPathId
    );

  if (!learningPath) {
    throw new Error(
      "LEARNING_PATH_NOT_FOUND"
    );
  }

  if (
    learningPath.userId !==
    userId
  ) {
    throw new Error(
      "UNAUTHORIZED_LEARNING_PATH_ACCESS"
    );
  }

  return learningPath;
};

// ==================================================
// UPDATE LEARNING PATH
// ==================================================

export const updateMyLearningPath = async (
  userId: string,
  learningPathId: string,
  data: {
    title?: string;
    description?: string | null;
  }
) => {
  // ------------------------------------------------
  // VERIFY OWNERSHIP
  // ------------------------------------------------

  await getMyLearningPath(
    userId,
    learningPathId
  );

  // ------------------------------------------------
  // UPDATE
  // ------------------------------------------------

  return updateLearningPath(
    learningPathId,
    {
      title:
        data.title?.trim(),

      description:
        data.description?.trim(),
    }
  );
};

// ==================================================
// DELETE LEARNING PATH
// ==================================================

export const removeLearningPath = async (
  userId: string,
  learningPathId: string
) => {
  // ------------------------------------------------
  // VERIFY OWNERSHIP
  // ------------------------------------------------

  await getMyLearningPath(
    userId,
    learningPathId
  );

  // ------------------------------------------------
  // DELETE
  // ------------------------------------------------

  await deleteLearningPath(
    learningPathId
  );
};

// ==================================================
// ADD RESOURCE TO LEARNING PATH
// ==================================================

export const addResourceToLearningPath = async (
  userId: string,
  learningPathId: string,
  data: {
    resourceId: string;
    milestone?: string;
  }
) => {
  // ------------------------------------------------
  // VERIFY PATH
  // ------------------------------------------------

  await getMyLearningPath(
    userId,
    learningPathId
  );

  // ------------------------------------------------
  // VERIFY RESOURCE
  // ------------------------------------------------

  const resource =
    await findResourceById(
      data.resourceId
    );

  if (!resource) {
    throw new Error(
      "RESOURCE_NOT_FOUND"
    );
  }

  // ------------------------------------------------
  // CHECK DUPLICATE
  // ------------------------------------------------

  const existing =
    await findLearningStepByPathAndResource(
      learningPathId,
      data.resourceId
    );

  if (existing) {
    throw new Error(
      "RESOURCE_ALREADY_IN_PATH"
    );
  }

  // ------------------------------------------------
  // GET NEXT ORDER
  // ------------------------------------------------

  const maxOrder =
    await findMaxStepOrder(
      learningPathId
    );

  const order =
    maxOrder === null
      ? 1
      : maxOrder + 1;

  // ------------------------------------------------
  // CREATE STEP
  // ------------------------------------------------

  return createLearningStep({
    learningPathId,

    resourceId:
      data.resourceId,

    order,

    milestone:
      data.milestone?.trim(),
  });
};

// ==================================================
// REMOVE LEARNING STEP
// ==================================================

export const removeLearningStep = async (
  userId: string,
  learningPathId: string,
  stepId: number
) => {
  // ------------------------------------------------
  // VERIFY PATH
  // ------------------------------------------------

  await getMyLearningPath(
    userId,
    learningPathId
  );

  // ------------------------------------------------
  // FIND STEP
  // ------------------------------------------------

  const step =
    await findLearningStepById(
      stepId
    );

  if (!step) {
    throw new Error(
      "LEARNING_STEP_NOT_FOUND"
    );
  }

  // ------------------------------------------------
  // VERIFY STEP BELONGS TO PATH
  // ------------------------------------------------

  if (
    step.learningPathId !==
    learningPathId
  ) {
    throw new Error(
      "LEARNING_STEP_NOT_IN_PATH"
    );
  }

  // ------------------------------------------------
  // DELETE
  // ------------------------------------------------

  await deleteLearningStep(
    stepId
  );
};

// ==================================================
// REORDER LEARNING STEP
// ==================================================

export const reorderLearningStep = async (
  userId: string,
  learningPathId: string,
  stepId: number,
  order: number
) => {
  // ------------------------------------------------
  // VERIFY PATH
  // ------------------------------------------------

  await getMyLearningPath(
    userId,
    learningPathId
  );

  // ------------------------------------------------
  // VALIDATE ORDER
  // ------------------------------------------------

  if (
    !Number.isInteger(order) ||
    order < 1
  ) {
    throw new Error(
      "INVALID_STEP_ORDER"
    );
  }

  // ------------------------------------------------
  // FIND STEP
  // ------------------------------------------------

  const step =
    await findLearningStepById(
      stepId
    );

  if (!step) {
    throw new Error(
      "LEARNING_STEP_NOT_FOUND"
    );
  }

  // ------------------------------------------------
  // VERIFY STEP BELONGS TO PATH
  // ------------------------------------------------

  if (
    step.learningPathId !==
    learningPathId
  ) {
    throw new Error(
      "LEARNING_STEP_NOT_IN_PATH"
    );
  }

  // ------------------------------------------------
  // UPDATE ORDER
  // ------------------------------------------------

  return updateLearningStepOrder(
    stepId,
    order
  );
};