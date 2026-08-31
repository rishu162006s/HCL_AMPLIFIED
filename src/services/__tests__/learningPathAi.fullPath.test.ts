import test from "node:test";
import assert from "node:assert/strict";

import { collectGoalTopicGraph } from "../learningPathGraph";

test("collectGoalTopicGraph includes all relevant topics and prerequisite ancestors", () => {
  const topicMap = new Map<string, any>([
    [
      "root-topic",
      {
        id: "root-topic",
        name: "Root Topic",
        prerequisites: [],
        resources: [{ resource: { id: "r1" } }],
      },
    ],
    [
      "mid-topic",
      {
        id: "mid-topic",
        name: "Mid Topic",
        prerequisites: [{ prerequisiteId: "root-topic" }],
        resources: [{ resource: { id: "r2" } }],
      },
    ],
    [
      "advanced-topic",
      {
        id: "advanced-topic",
        name: "Advanced Topic",
        prerequisites: [{ prerequisiteId: "mid-topic" }],
        resources: [{ resource: { id: "r3" } }],
      },
    ],
    [
      "side-topic",
      {
        id: "side-topic",
        name: "Side Topic",
        prerequisites: [],
        resources: [{ resource: { id: "r4" } }],
      },
    ],
  ]);

  const topicIds = collectGoalTopicGraph(["advanced-topic", "side-topic"], topicMap);

  assert.deepEqual([...topicIds].sort(), ["advanced-topic", "mid-topic", "root-topic", "side-topic"].sort());
});
