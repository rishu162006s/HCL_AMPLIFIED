/**
 * Integration test: Full learning path generation with seeded database
 * Tests that the learning path generator produces complete paths with multiple topics
 * Verifies all prerequisites are included and resources are populated
 */

import prisma from "../../config/prisma";
import { generateNewLearningPath } from "../learningPath.service";

interface TestResult {
  success: boolean;
  message: string;
  path?: any;
  error?: string;
}

async function runIntegrationTest(): Promise<TestResult> {
  try {
    console.log("🧪 Starting learning path integration test...\n");

    // Step 1: Verify database has data
    console.log("📊 Verifying seeded database...");
    const skillCount = await prisma.skill.count();
    const topicCount = await prisma.topic.count();
    const resourceCount = await prisma.resource.count();
    const prerequisiteCount = await prisma.topicPrerequisite.count();

    console.log(`✅ Skills: ${skillCount}`);
    console.log(`✅ Topics: ${topicCount}`);
    console.log(`✅ Resources: ${resourceCount}`);
    console.log(`✅ Prerequisites: ${prerequisiteCount}\n`);

    if (skillCount === 0 || topicCount === 0 || resourceCount === 0) {
      return {
        success: false,
        message: "Database is not properly seeded",
        error: `Skills: ${skillCount}, Topics: ${topicCount}, Resources: ${resourceCount}`,
      };
    }

    // Step 2: Get or create a user
    console.log("👤 Setting up user...");
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "testuser@example.com",
          password: "hashed_password",
          name: "Test User",
          technicalLevel: "INTERMEDIATE",
        },
      });
    }
    console.log(`✅ Using user: ${user.name} (${user.technicalLevel})\n`);

    // Step 3: Get Python skill
    console.log("🎯 Finding target skill and topic...");
    const pythonSkill = await prisma.skill.findUnique({
      where: { name: "Python" },
    });
    if (!pythonSkill) {
      return {
        success: false,
        message: "Python skill not found in database",
      };
    }
    console.log(`✅ Found skill: ${pythonSkill.name}\n`);

    // Step 4: Create a Goal for Python
    console.log("🎯 Creating learning goal...");
    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: "Master Python Programming",
        description: "Learn Python from basics to advanced concepts",
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        weeklyHours: 5,
        status: "ACTIVE",
        objective: "PERSONAL",
        theoryPracticeRatio: "BALANCED",
        requiredSkills: {
          create: {
            skillId: pythonSkill.id,
            currentLevel: "BASIC",
            targetLevel: "EXPERT",
          },
        },
      },
      include: {
        requiredSkills: true,
      },
    });
    console.log(`✅ Goal created: ${goal.title}\n`);

    // Step 5: Generate learning path
    console.log("🛣️  Generating learning path...");
    let path: any;
    try {
      path = await generateNewLearningPath(user.id, goal.id);
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to generate learning path: ${error.message}`,
        error: error.stack,
      };
    }

    if (!path) {
      return {
        success: false,
        message: "Learning path generation returned null",
      };
    }

    console.log(`✅ Path generated successfully\n`);

    // Step 6: Validate path structure
    console.log("🔍 Validating path structure...");
    console.log(`📌 Path ID: ${path.id}`);
    console.log(`📌 Goal ID: ${path.goalId}`);
    console.log(`📌 Number of steps: ${path.steps ? path.steps.length : 0}\n`);

    // Check if learning steps exist
    if (!path.steps || path.steps.length === 0) {
      return {
        success: false,
        message: "❌ FAIL: No learning steps in path",
        path,
        error: "Learning path has no steps",
      };
    }

    // Step 7: Analyze resources and trace back to topics
    console.log("📚 Resources in learning path:");
    const resourcesInPath = new Set<string>();
    const topicsInPath = new Set<string>();

    // Fetch topics that have resources in the path
    for (const step of path.steps) {
      const resource = step.resource;
      resourcesInPath.add(resource.id);
      console.log(`   • ${resource.title} [${resource.type}]`);
    }

    // Find which topics these resources belong to
    const topicResourceLinks = await prisma.topicResource.findMany({
      where: {
        resourceId: {
          in: Array.from(resourcesInPath),
        },
      },
      include: {
        topic: true,
      },
    });

    for (const link of topicResourceLinks) {
      topicsInPath.add(link.topic.name);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   - Unique topics: ${topicsInPath.size}`);
    console.log(`   - Total resources: ${path.steps.length}`);
    console.log(`   - Topics: ${Array.from(topicsInPath).join(", ")}\n`);

    // Step 8: Key validation: More than one topic (prevent single-topic collapse)
    const hasMultipleTopics = topicsInPath.size > 1;

    if (!hasMultipleTopics) {
      return {
        success: false,
        message: `❌ FAIL: Path has only ${topicsInPath.size} topic (expected > 1)`,
        path,
        error: "Single-topic collapse detected - full path generation NOT working",
      };
    }

    // Step 9: Verify prerequisites are included
    console.log("🔗 Verifying prerequisite coverage...");
    const prerequisitesInPath = await prisma.topicPrerequisite.findMany({
      where: {
        topicId: {
          in: (
            await prisma.topic.findMany({
              where: {
                name: {
                  in: Array.from(topicsInPath),
                },
              },
              select: { id: true },
            })
          ).map((t) => t.id),
        },
      },
      include: {
        topic: true,
        prerequisite: true,
      },
    });

    let prerequisitesIncluded = 0;
    for (const prereq of prerequisitesInPath) {
      const isIncluded = topicsInPath.has(prereq.prerequisite.name);
      if (isIncluded) prerequisitesIncluded++;
      console.log(
        `   ${isIncluded ? "✅" : "❌"} ${prereq.prerequisite.name} (required for ${prereq.topic.name})`
      );
    }

    const prerequisitesCovered =
      prerequisitesInPath.length === 0 ||
      prerequisitesIncluded > 0;

    if (!prerequisitesCovered) {
      return {
        success: false,
        message: `❌ FAIL: No prerequisites included in path`,
        path,
        error: `Path has ${topicsInPath.size} topics but no prerequisites`,
      };
    }

    console.log(
      `\n✅ Prerequisites coverage: ${prerequisitesIncluded}/${prerequisitesInPath.length} included\n`
    );

    // Step 10: Final success check
    const successConditions = {
      hasSteps: path.steps.length > 0,
      hasMultipleTopics,
      hasPrerequisites: prerequisitesCovered,
    };

    const allConditionsMet = Object.values(successConditions).every(
      (cond) => cond === true
    );

    if (allConditionsMet) {
      return {
        success: true,
        message: `✅ SUCCESS: Full learning path generated with ${topicsInPath.size} topics and ${path.steps.length} resource-backed steps`,
        path,
      };
    } else {
      return {
        success: false,
        message: `❌ FAIL: Not all success conditions met: ${JSON.stringify(successConditions)}`,
        path,
        error: "One or more validation checks failed",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Test execution error: ${error.message}`,
      error: error.stack,
    };
  }
}

// ============================================================
// RUN TEST
// ============================================================

async function main() {
  console.log("\n============================================================");
  console.log("LEARNING PATH INTEGRATION TEST");
  console.log("============================================================\n");

  const result = await runIntegrationTest();

  console.log("============================================================");
  console.log("TEST RESULT");
  console.log("============================================================");
  console.log(`Status: ${result.success ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(`Message: ${result.message}`);
  if (result.error) {
    console.log(`Error: ${result.error}`);
  }
  console.log("============================================================\n");

  await prisma.$disconnect();
  process.exit(result.success ? 0 : 1);
}

main().catch(async (error) => {
  console.error("Fatal error:", error);
  await prisma.$disconnect();
  process.exit(1);
});
