import prisma from "../config/prisma";

const skillMap: Record<string, string[]> = {
  "machine learning": [
    "Python",
    "Statistics",
    "Linear Algebra",
    "Machine Learning",
  ],

  tensorflow: [
    "TensorFlow",
    "Deep Learning",
  ],

  "web development": [
    "HTML",
    "CSS",
    "JavaScript",
    "Git",
  ],

  "backend development": [
    "JavaScript",
    "Node.js",
    "Express",
    "REST APIs",
    "PostgreSQL",
    "SQL",
    "Git",
  ],
};

export const analyzeGoal = async (
  goalId: string,
  userId: string
) => {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    throw new Error("GOAL_NOT_FOUND");
  }

  const goalText =
    `${goal.title} ${goal.description || ""}`.toLowerCase();

  const detectedSkills = new Set<string>();

  for (const [keyword, skills] of Object.entries(skillMap)) {
    if (goalText.includes(keyword)) {
      skills.forEach((skill) => {
        detectedSkills.add(skill);
      });
    }
  }

  if (detectedSkills.size === 0) {
    throw new Error("NO_SKILLS_DETECTED");
  }

  const goalSkills = [];

  for (const skillName of detectedSkills) {
    const skill = await prisma.skill.upsert({
      where: {
        name: skillName,
      },
      update: {},
      create: {
        name: skillName,
      },
    });

    const goalSkill = await prisma.goalSkill.upsert({
      where: {
        goalId_skillId: {
          goalId,
          skillId: skill.id,
        },
      },
      update: {},
      create: {
        goalId,
        skillId: skill.id,
        currentLevel: "NONE",
        targetLevel: "INTERMEDIATE",
      },
      include: {
        skill: true,
      },
    });

    goalSkills.push(goalSkill);
  }

  return {
    goal,
    skills: goalSkills,
  };
};