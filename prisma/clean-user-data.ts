import prisma from "../src/config/prisma";

async function cleanUserData() {
  console.log("Cleaning user test data from database...");

  try {
    // Delete user dependent tables first to respect foreign keys
    await prisma.quizAttempt.deleteMany({});
    await prisma.topicMastery.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.progress.deleteMany({});
    await prisma.learningHistory.deleteMany({});
    await prisma.learningStep.deleteMany({});
    await prisma.learningPath.deleteMany({});
    await prisma.goalSkill.deleteMany({});
    await prisma.goal.deleteMany({});
    await prisma.userSkill.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Successfully cleaned all user test data!");
  } catch (err) {
    console.error("Error cleaning user test data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

cleanUserData();
