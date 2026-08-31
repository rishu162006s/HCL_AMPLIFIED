import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

interface NormalizedData {
  skills: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  topics: Record<
    string,
    Array<{
      id: string;
      skillId: string;
      name: string;
      description?: string;
      prerequisites: string[];
      difficultyLevel?: string;
    }>
  >;
  resources: Array<{
    topicId: string;
    title: string;
    type: "COURSE" | "PROJECT" | "ARTICLE" | "VIDEO" | "BOOK" | "ASSESSMENT";
    url: string;
    description?: string;
  }>;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Load normalized data
  const dataPath = path.join(
    __dirname,
    "normalized-learning-data.json"
  );
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data: NormalizedData = JSON.parse(rawData);

  // Clear existing data
  console.log("🗑️ Clearing existing data...");
  await prisma.topicResource.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.topicPrerequisite.deleteMany({});
  await prisma.topic.deleteMany({});
  await prisma.skill.deleteMany({});

  // Seed skills
  console.log("📚 Seeding skills...");
  const seedSkills = await Promise.all(
    data.skills.map((skill) =>
      prisma.skill.create({
        data: {
          name: skill.name,
          description: skill.description,
        },
      })
    )
  );

  const skillMap = new Map(
    seedSkills.map((skill) => [skill.name, skill.id])
  );

  console.log(`✅ Created ${seedSkills.length} skills`);

  // Seed topics
  console.log("📖 Seeding topics...");
  const allTopicsData = Object.values(data.topics).flat();
  const seedTopics = await Promise.all(
    allTopicsData.map((topic) => {
      const skillId = skillMap.get(
        data.skills.find((s) => s.id === topic.skillId)?.name || ""
      );
      if (!skillId) {
        throw new Error(`Skill not found for topic ${topic.name}`);
      }

      return prisma.topic.create({
        data: {
          name: topic.name,
          description: topic.description,
          skillId,
        },
      });
    })
  );

  // Map by topic name (not ID) for prerequisite linking
  const topicMap = new Map(seedTopics.map((topic) => [topic.name, topic.id]));

  console.log(`✅ Created ${seedTopics.length} topics`);

  // Seed topic prerequisites
  console.log("🔗 Seeding topic prerequisites...");
  let prerequisiteCount = 0;
  for (const topic of allTopicsData) {
    const topicId = topicMap.get(topic.name);
    if (!topicId) continue;

    for (const prerequisiteName of topic.prerequisites) {
      const prerequisiteId = topicMap.get(prerequisiteName);
      if (prerequisiteId) {
        await prisma.topicPrerequisite.create({
          data: {
            topicId,
            prerequisiteId,
          },
        });
        prerequisiteCount++;
      } else {
        console.warn(`⚠️ Prerequisite "${prerequisiteName}" not found for topic "${topic.name}"`);
      }
    }
  }

  console.log(`✅ Created ${prerequisiteCount} prerequisites`);

  // Seed resources
  console.log("🎓 Seeding resources...");
  const seedResources = await Promise.all(
    data.resources.map((resource) => {
      return prisma.resource.create({
        data: {
          title: resource.title,
          description: resource.description,
          type: resource.type,
          url: resource.url,
          difficulty: "INTERMEDIATE",
        },
      });
    })
  );

  const resourcesByTopic = new Map<string, typeof seedResources>();
  data.resources.forEach((resource, index) => {
    if (!resourcesByTopic.has(resource.topicId)) {
      resourcesByTopic.set(resource.topicId, []);
    }
    resourcesByTopic.get(resource.topicId)!.push(seedResources[index]);
  });

  console.log(`✅ Created ${seedResources.length} resources`);

  // Link resources to topics
  console.log("🔀 Linking resources to topics...");
  let linkCount = 0;
  for (const [topicName, resources] of resourcesByTopic) {
    const topicId = topicMap.get(topicName);
    if (!topicId) {
      console.warn(`⚠️ Topic "${topicName}" not found for resources linking`);
      continue;
    }

    for (const resource of resources) {
      await prisma.topicResource.create({
        data: {
          topicId,
          resourceId: resource.id,
        },
      });
      linkCount++;
    }
  }

  console.log(`✅ Linked ${linkCount} resources to topics`);

  // Summary
  console.log("\n✨ Database seed completed successfully!");
  console.log(`📊 Summary:`);
  console.log(`  - Skills: ${seedSkills.length}`);
  console.log(`  - Topics: ${seedTopics.length}`);
  console.log(`  - Prerequisites: ${prerequisiteCount}`);
  console.log(`  - Resources: ${seedResources.length}`);
  console.log(`  - Topic-Resource Links: ${linkCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
