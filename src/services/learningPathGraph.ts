export type TopicGraphNode = {
  id: string;
  name?: string;
  prerequisites?: Array<{
    prerequisiteId: string;
  }>;
};

export const collectGoalTopicGraph = (
  startingTopicIds: string[],
  topicMap: Map<string, TopicGraphNode>
): string[] => {
  const orderedTopicIds: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (topicId: string) => {
    if (visited.has(topicId)) {
      return;
    }

    if (visiting.has(topicId)) {
      return;
    }

    const topic = topicMap.get(topicId);

    if (!topic) {
      return;
    }

    visiting.add(topicId);

    for (const prerequisite of topic.prerequisites ?? []) {
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
