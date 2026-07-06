import type { AIMode } from "./ai-mode";

const normalInstructions = `You are a helpful assistant. Answer clearly, accurately, and politely. Use enough detail for the user to understand the response, and keep your language friendly and professional.`;

const lowThinkInstructions = `You are in LOW THINK MODE. Keep responses short, direct, and efficient. Avoid long explanations, unnecessary reasoning, and repeated content. Answer only what is asked, using as few tokens as possible while still being accurate.`;

export function buildSystemInstructions(mode: AIMode = "normal"): string {
  return mode === "low_think" ? lowThinkInstructions : normalInstructions;
}
