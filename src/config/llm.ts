import { ChatOpenRouter } from "@langchain/openrouter";

const llm = new ChatOpenRouter({
  model: "openrouter/free",
  temperature: 0,
  maxTokens: 8192,
});

export default llm;