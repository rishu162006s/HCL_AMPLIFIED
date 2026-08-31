import llm from "../config/llm";

import {
  learningPathSchema,
} from "../validators/learningPathAI.validator";

import { findGoalById } from "../repositories/goal.repository";

import prisma from "../config/prisma";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type TopicWithRelations = {
  id: string;
  name: string;
  description: string | null;
  skillId: string;
  createdAt: Date;

  skill: {
    id: string;
    name: string;
  };

  prerequisites: Array<{
    prerequisiteId: string;
    prerequisite: {
      id: string;
      name: string;
    };
  }>;

  resources: Array<{
    resourceId: string;
    resource: {
      id: string;
      title: string;
      type: string;
    };
  }>;
};

// --------------------------------------------------
// EXPAND TOPIC PREREQUISITES
// --------------------------------------------------

export const collectGoalTopicGraph = (
  startingTopicIds: string[],
  topicMap: Map<string, TopicWithRelations>
) => {
  const orderedTopicIds: string[] = [];

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (topicId: string) => {
    if (visited.has(topicId)) {
      return;
    }

    if (visiting.has(topicId)) {
      throw new Error(
        "TOPIC_PREREQUISITE_CYCLE"
      );
    }

    const topic = topicMap.get(topicId);

    if (!topic) {
      return;
    }

    visiting.add(topicId);

    for (const prerequisite of topic.prerequisites) {
      visit(prerequisite.prerequisiteId);
    }

    visiting.delete(topicId);
    visited.add(topicId);

    orderedTopicIds.push(topicId);
  };

  for (const topicId of startingTopicIds) {
    visit(topicId);
  }

  return orderedTopicIds;
};

const expandTopicPrerequisites = (
  selectedTopicIds: string[],
  topicMap: Map<string, TopicWithRelations>
) => {
  return collectGoalTopicGraph(
    selectedTopicIds,
    topicMap
  );
};

// --------------------------------------------------
// GENERATE AI LEARNING PATH
// --------------------------------------------------

export const generateLearningPathWithAI = async (
  goalId: string,
  userId: string
) => {
  // ------------------------------------------------
  // GET GOAL
  // ------------------------------------------------

  const goal = await findGoalById(goalId);

  if (!goal) {
    throw new Error(
      "GOAL_NOT_FOUND"
    );
  }

  if (goal.userId !== userId) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  // ------------------------------------------------
  // GET REQUIRED GOAL SKILLS
  // ------------------------------------------------

  const goalSkills =
    await prisma.goalSkill.findMany({
      where: {
        goalId,
      },
      include: {
        skill: true,
      },
    });

  if (goalSkills.length === 0) {
    throw new Error(
      "NO_GOAL_SKILLS"
    );
  }

  // ------------------------------------------------
  // GET USER SKILLS
  // ------------------------------------------------

  const userSkills =
    await prisma.userSkill.findMany({
      where: {
        userId,
      },
      include: {
        skill: true,
      },
    });

  // ------------------------------------------------
  // GET ALL TOPICS FOR REQUIRED SKILLS
  // ------------------------------------------------

  const skillIds = goalSkills.map(
    (item) => item.skillId
  );

  const topics =
    await prisma.topic.findMany({
      where: {
        skillId: {
          in: skillIds,
        },
      },

      include: {
        skill: true,

        prerequisites: {
          include: {
            prerequisite: true,
          },
        },

        resources: {
          include: {
            resource: true,
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

  // ------------------------------------------------
  // ONLY TOPICS WITH RESOURCES CAN BE DIRECTLY USED
  // ------------------------------------------------

  let usableTopics =
    topics.filter(
      (topic) =>
        topic.resources.length > 0
    );

  if (usableTopics.length === 0) {
    const allTopics = await prisma.topic.findMany({
      where: {
        resources: {
          some: {},
        },
      },
      include: {
        skill: true,
        prerequisites: {
          include: {
            prerequisite: true,
          },
        },
        resources: {
          include: {
            resource: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    topics.push(...(allTopics as typeof topics));
    usableTopics = allTopics as typeof usableTopics;
  }

  // ------------------------------------------------
  // TOPIC MAP
  //
  // IMPORTANT:
  // Use ALL topics here, not only usable topics.
  //
  // Why?
  // A topic can be a prerequisite of another topic
  // and still needs to be found in the database.
  // ------------------------------------------------

  const topicMap =
    new Map<string, TopicWithRelations>();

  for (const topic of topics) {
    topicMap.set(
      topic.id,
      topic as TopicWithRelations
    );
  }

  // ------------------------------------------------
  // BUILD AVAILABLE TOPICS FOR AI
  // ------------------------------------------------

  const availableTopics =
    usableTopics
      .map((topic) => {
        const prerequisites =
          topic.prerequisites
            .map(
              (p) =>
                p.prerequisite.name
            )
            .join(", ");

        const resources =
          topic.resources
            .map(
              (tr) =>
                `${tr.resource.title} [${tr.resource.type}]`
            )
            .join(", ");

        return `
TOPIC_ID: ${topic.id}
SKILL: ${topic.skill.name}
TOPIC: ${topic.name}
DESCRIPTION: ${
          topic.description || ""
        }
PREREQUISITES: ${
          prerequisites || "None"
        }
RESOURCES: ${resources}
`;
      })
      .join("\n");

  // ------------------------------------------------
  // BUILD USER SKILLS
  // ------------------------------------------------

  const existingSkills =
    userSkills.length > 0
      ? userSkills
          .map(
            (item) =>
              `${item.skill.name}: ${item.level}`
          )
          .join("\n")
      : "No existing skills recorded.";

  // ------------------------------------------------
  // BUILD REQUIRED SKILLS
  // ------------------------------------------------

  const requiredSkills =
    goalSkills
      .map(
        (item) =>
          `${item.skill.name}: current=${item.currentLevel}, target=${item.targetLevel}`
      )
      .join("\n");

  // ------------------------------------------------
  // AI PROMPT
  // ------------------------------------------------

  const prompt = `
You are an expert personalized learning-path planner.

Create a realistic, progressive and practical learning path
using ONLY the topics supplied below.

==================================================
GOAL
==================================================

Title:
${goal.title}

Description:
${goal.description || "No description provided"}

Objective:
${goal.objective}

Weekly study hours:
${goal.weeklyHours ?? "Not specified"}

Theory/practice preference:
${goal.theoryPracticeRatio ?? "BALANCED"}

==================================================
REQUIRED SKILLS
==================================================

${requiredSkills}

==================================================
USER'S EXISTING SKILLS
==================================================

${existingSkills}

==================================================
AVAILABLE TOPICS
==================================================

${availableTopics}

==================================================
STRICT RULES
==================================================

1. Use ONLY topics from AVAILABLE TOPICS.

2. NEVER invent a topic.

3. Every selected topic MUST use its exact TOPIC_ID.

4. Every selected topic MUST have at least one resource.

5. Build progressively from the user's current knowledge
   toward the required target level.

6. Respect topic prerequisites.

7. Prefer foundational topics before advanced topics.

8. Do not unnecessarily repeat topics.

9. Prefer practical learning according to:
   ${goal.theoryPracticeRatio ?? "BALANCED"}

10. Use multiple phases when appropriate.

11. estimatedDays must be a positive integer.

12. Phase numbers must start at 1 and increase sequentially.

13. Use exact topic IDs and exact topic names.

14. Do not include topics merely to make the path longer.

15. Do not invent resources.

16. Do not invent skills.

17. Return ONLY valid JSON.

IMPORTANT:

The backend will automatically expand prerequisite
relationships after the AI response.

Therefore, select only topics that are genuinely relevant
to achieving the goal.

==================================================
REQUIRED JSON FORMAT
==================================================

{
  "title": "string",
  "description": "string",
  "estimatedDays": 30,
  "phases": [
    {
      "phaseNumber": 1,
      "title": "string",
      "description": "string",
      "estimatedDays": 5,
      "topics": [
        {
          "topicId": "exact topic UUID",
          "name": "exact topic name",
          "description": "string",
          "priority": "LOW | MEDIUM | HIGH"
        }
      ]
    }
  ],
  "dailyStudyRecommendation": "string",
  "practicalProject": "string or null"
}

Return JSON only.
`;

  // ------------------------------------------------
  // ------------------------------------------------
  // CALL LLM WITH FALLBACK PROTECTION
  // ------------------------------------------------

  let learningPath: any = null;

  try {
    const response = await llm.invoke(prompt);
    let content =
      typeof response.content === "string"
        ? response.content
        : (response.content as any[])
            .map((item) => (typeof item === "string" ? item : item?.text || ""))
            .join("");

    content = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }

    const parsedAI = JSON.parse(content);
    const validated = learningPathSchema.safeParse(parsedAI);

    if (validated.success) {
      // Ensure all topic IDs exist in topicMap
      let allTopicsValid = true;
      for (const phase of validated.data.phases) {
        for (const aiTopic of phase.topics) {
          const t = topicMap.get(aiTopic.topicId);
          if (!t || t.resources.length === 0) {
            allTopicsValid = false;
            break;
          }
        }
      }

      if (allTopicsValid) {
        learningPath = validated.data;
      }
    }
  } catch (err) {
    console.warn("LLM invocation or JSON parsing failed, using structured fallback learning path:", err);
  }

  // ------------------------------------------------
  // FALLBACK LEARNING PATH BUILDER
  // ------------------------------------------------

  if (!learningPath) {
    const total = usableTopics.length;
    const p1Count = Math.ceil(total / 3);
    const p2Count = Math.ceil((total - p1Count) / 2);

    const p1Topics = usableTopics.slice(0, p1Count);
    const p2Topics = usableTopics.slice(p1Count, p1Count + p2Count);
    const p3Topics = usableTopics.slice(p1Count + p2Count);

    const mapTopics = (list: typeof usableTopics) =>
      list.map((t) => ({
        topicId: t.id,
        name: t.name,
        description: t.description || `Learn ${t.name}`,
        priority: "HIGH" as const,
      }));

    const phases = [];
    if (p1Topics.length > 0) {
      phases.push({
        phaseNumber: 1,
        title: "Foundations & Core Concepts",
        description: "Master the fundamental concepts and key building blocks.",
        estimatedDays: 7,
        topics: mapTopics(p1Topics),
      });
    }
    if (p2Topics.length > 0) {
      phases.push({
        phaseNumber: 2,
        title: "Intermediate Applications",
        description: "Apply concepts to practical problems and intermediate techniques.",
        estimatedDays: 14,
        topics: mapTopics(p2Topics),
      });
    }
    if (p3Topics.length > 0) {
      phases.push({
        phaseNumber: 3,
        title: "Advanced Mastery & Real-World Projects",
        description: "Advanced techniques, optimization, and practical application.",
        estimatedDays: 14,
        topics: mapTopics(p3Topics),
      });
    }

    learningPath = {
      title: `Personalized Path: ${goal.title}`,
      description: `Structured progressive learning path for ${goal.title}`,
      estimatedDays: 35,
      phases,
      dailyStudyRecommendation: "Study 1-2 hours per day",
      practicalProject: `Build a project demonstrating ${goal.title}`,
    };
  }

  // ------------------------------------------------
  // COLLECT AI SELECTED TOPICS
  // ------------------------------------------------

  const selectedTopicIds: string[] =
    [];

  for (
    const phase of
      learningPath.phases
  ) {
    for (
      const aiTopic of
        phase.topics
    ) {
      if (
        !selectedTopicIds.includes(
          aiTopic.topicId
        )
      ) {
        selectedTopicIds.push(
          aiTopic.topicId
        );
      }
    }
  }

  if (
    selectedTopicIds.length ===
    0
  ) {
    throw new Error(
      "AI_GENERATED_NO_TOPICS"
    );
  }

  const fullGoalTopicIds =
    collectGoalTopicGraph(
      usableTopics.map(
        (topic) =>
          topic.id
      ),
      topicMap
    );

  const expandedTopicIds =
    Array.from(
      new Set([
        ...selectedTopicIds,
        ...fullGoalTopicIds,
      ])
    );

  // ------------------------------------------------
  // EXPAND PREREQUISITES
  // ------------------------------------------------

  const orderedTopicIds =
    expandTopicPrerequisites(
      expandedTopicIds,
      topicMap
    );

  // ------------------------------------------------
  // VERIFY EVERY EXPANDED TOPIC
  // HAS A RESOURCE
  // ------------------------------------------------

  for (
    const topicId of
      orderedTopicIds
  ) {
    const topic =
      topicMap.get(
        topicId
      );

    if (!topic) {
      throw new Error(
        "TOPIC_PREREQUISITE_NOT_FOUND"
      );
    }

    if (
      topic.resources.length ===
      0
    ) {
      throw new Error(
        "PREREQUISITE_HAS_NO_RESOURCE"
      );
    }
  }

  // ------------------------------------------------
  // AI TOPIC LOOKUP
  // ------------------------------------------------

  const aiTopicMap =
    new Map<string, any>();

  for (
    const phase of
      learningPath.phases
  ) {
    for (
      const aiTopic of
        phase.topics
    ) {
      aiTopicMap.set(
        aiTopic.topicId,
        aiTopic
      );
    }
  }

  // ------------------------------------------------
  // REBUILD PHASES
  // ------------------------------------------------

  const phaseTemplates =
    learningPath.phases.length > 0
      ? learningPath.phases
      : [
          {
            phaseNumber: 1,
            title: "Foundations and Prerequisites",
            description:
              "Build the prerequisite knowledge required for the selected learning path.",
            estimatedDays: 7,
            topics: [],
          },
          {
            phaseNumber: 2,
            title: "Core Skills and Practice",
            description:
              "Apply the fundamentals to practical learning and project work.",
            estimatedDays: 14,
            topics: [],
          },
          {
            phaseNumber: 3,
            title: "Advanced Mastery",
            description:
              "Complete the advanced concepts and final applied work.",
            estimatedDays: 14,
            topics: [],
          },
        ];

  const finalPhases: any[] =
    phaseTemplates.map(
      (phase: typeof phaseTemplates[number]) => ({
        ...phase,
        topics: [],
      })
    );

  for (
    let index = 0;
    index <
    orderedTopicIds.length;
    index++
  ) {
    const topicId =
      orderedTopicIds[index];

    const topic =
      topicMap.get(topicId);

    if (!topic) {
      throw new Error(
        "TOPIC_PREREQUISITE_NOT_FOUND"
      );
    }

    const phaseIndex =
      finalPhases.length === 1
        ? 0
        : Math.min(
            finalPhases.length - 1,
            Math.floor(
              index /
                Math.max(
                  1,
                  Math.ceil(
                    orderedTopicIds.length /
                      finalPhases.length
                  )
                )
            )
          );

    const aiTopic =
      aiTopicMap.get(topicId);

    finalPhases[phaseIndex].topics.push({
      topicId,
      name: topic.name,
      description:
        topic.description ||
        aiTopic?.description ||
        "",
      priority:
        aiTopic?.priority ||
        "MEDIUM",
    });
  }

  finalPhases.forEach(
    (phase, index) => {
      phase.phaseNumber = index + 1;
      phase.estimatedDays =
        phase.estimatedDays ||
        Math.max(1, phase.topics.length * 2);
    }
  );

  // ------------------------------------------------
  // ADD PREREQUISITES NOT SELECTED BY AI
  // ------------------------------------------------

  const selectedByAI =
    new Set(
      selectedTopicIds
    );

  const addedPrerequisites =
    orderedTopicIds.filter(
      (topicId) =>
        !selectedByAI.has(
          topicId
        )
    );

  if (
    addedPrerequisites.length >
    0
  ) {
    const foundationTopics =
      addedPrerequisites.map(
        (topicId) => {
          const topic =
            topicMap.get(
              topicId
            );

          /*
           * IMPORTANT FIX
           *
           * Explicitly narrow undefined.
           */
          if (!topic) {
            throw new Error(
              "TOPIC_PREREQUISITE_NOT_FOUND"
            );
          }

          return {
            topicId,

            name:
              topic.name,

            description:
              topic.description ||
              "",

            priority:
              "HIGH",
          };
        }
      );

    finalPhases.unshift({
      phaseNumber: 1,

      title:
        "Foundations and Prerequisites",

      description:
        "Build the prerequisite knowledge required for the selected learning path.",

      estimatedDays:
        Math.max(
          1,
          addedPrerequisites.length *
            2
        ),

      topics:
        foundationTopics,
    });
  }

  // ------------------------------------------------
  // RE-NUMBER PHASES
  // ------------------------------------------------

  finalPhases.forEach(
    (phase, index) => {
      phase.phaseNumber =
        index + 1;
    }
  );

  // ------------------------------------------------
  // FINAL TOPIC ORDER
  // ------------------------------------------------

  const finalTopicOrder: string[] =
    [];

  for (
    const phase of
      finalPhases
  ) {
    for (
      const topic of
        phase.topics
    ) {
      finalTopicOrder.push(
        topic.topicId
      );
    }
  }

  // ------------------------------------------------
  // FINAL PREREQUISITE ORDER CHECK
  // ------------------------------------------------

  const finalTopicIndex =
    new Map<string, number>();

  finalTopicOrder.forEach(
    (topicId, index) => {
      finalTopicIndex.set(
        topicId,
        index
      );
    }
  );

  for (
    const topicId of
      finalTopicOrder
  ) {
    const topic =
      topicMap.get(
        topicId
      );

    if (!topic) {
      throw new Error(
        "AI_INVALID_LEARNING_PATH"
      );
    }

    for (
      const prerequisiteRelation of
        topic.prerequisites
    ) {
      const prerequisiteId =
        prerequisiteRelation.prerequisiteId;

      /*
       * Only check prerequisites that
       * are actually present in the final path.
       */
      if (
        finalTopicIndex.has(
          prerequisiteId
        )
      ) {
        const topicIndex =
          finalTopicIndex.get(
            topicId
          );

        const prerequisiteIndex =
          finalTopicIndex.get(
            prerequisiteId
          );

        if (
          topicIndex ===
            undefined ||
          prerequisiteIndex ===
            undefined
        ) {
          throw new Error(
            "AI_INVALID_PREREQUISITE_ORDER"
          );
        }

        if (
          prerequisiteIndex >=
          topicIndex
        ) {
          console.error(
            "Invalid prerequisite ordering:",
            {
              topic:
                topic.name,

              prerequisite:
                prerequisiteRelation
                  .prerequisite
                  .name,
            }
          );

          throw new Error(
            "AI_INVALID_PREREQUISITE_ORDER"
          );
        }
      }
    }
  }

  // ------------------------------------------------
  // RETURN
  // ------------------------------------------------

  return {
    goal,

    goalSkills,

    topics,

    usableTopics,

    learningPath: {
      ...learningPath,

      phases:
        finalPhases,
    },
  };
};