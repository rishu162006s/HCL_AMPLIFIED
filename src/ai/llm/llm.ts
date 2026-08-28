import { ChatOpenRouter } from "@langchain/openrouter";

const llm = new ChatOpenRouter({
  model: "openrouter/free",
  temperature: 0,
  maxTokens: 2048,
});

export default llm;