import { findUserSkills } from "../repositories/skill.repository";
import {
  findTopicsBySkill,
  findUserTopicMasteries,
} from "../repositories/topic.repository";
import { findProgressByUserId } from "../repositories/progress.repository";
import { findResourcesByTopicId } from "../repositories/resource.repository";

export const generateRecommendations = async (
  userId: string,
  skillId?: string,
  limit = 10
) => {
  const userSkills = await findUserSkills(userId);

  const selectedSkills = skillId
    ? userSkills.filter(
        (item) => item.skillId === skillId
      )
    : userSkills;

  if (selectedSkills.length === 0) {
    return [];
  }

  const masteries = await findUserTopicMasteries(userId);

  const progress = await findProgressByUserId(userId);

  const masteryMap = new Map(
    masteries.map((item) => [
      item.topicId,
      item,
    ])
  );

  const progressMap = new Map(
    progress.map((item) => [
      item.resourceId,
      item,
    ])
  );

  const recommendations: any[] = [];

  for (const userSkill of selectedSkills) {
    const topics = await findTopicsBySkill(
      userSkill.skillId
    );

    for (const topic of topics) {
      const mastery = masteryMap.get(topic.id);

      // Already prepared/mastered
      if (
        mastery &&
        (mastery.status === "PREPARED" ||
          mastery.score >= 80)
      ) {
        continue;
      }

      // Check prerequisites
      let prerequisitesCompleted = true;

      for (const prerequisite of topic.prerequisites) {
        const prerequisiteMastery =
          masteryMap.get(
            prerequisite.prerequisiteId
          );

        if (
          !prerequisiteMastery ||
          (prerequisiteMastery.status !== "PREPARED" &&
            prerequisiteMastery.score < 80)
        ) {
          prerequisitesCompleted = false;
          break;
        }
      }

      if (!prerequisitesCompleted) {
        continue;
      }

      const resources =
        await findResourcesByTopicId(topic.id);

      const completedResources =
        resources.filter((resource) => {
          const item = progressMap.get(
            resource.id
          );

          return (
            item?.status === "COMPLETED" ||
            item?.progress === 100
          );
        });

      let score = 100;

      // Topics with lower mastery get higher priority
      if (mastery) {
        score -= mastery.score;
      }

      // Never-started topics get priority
      if (!mastery) {
        score += 20;
      }

      // Prefer topics with available resources
      if (resources.length > 0) {
        score += 10;
      }

      recommendations.push({
        topic,
        resources,
        completedResources:
          completedResources.length,
        mastery: mastery ?? null,
        recommendationScore: score,
      });
    }
  }

  recommendations.sort(
    (a, b) =>
      b.recommendationScore -
      a.recommendationScore
  );

  return recommendations.slice(0, limit);
};