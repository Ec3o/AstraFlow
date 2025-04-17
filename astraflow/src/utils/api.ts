import axios from "axios";

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const BASE_URL = "https://api.deepseek.com/v1";

export const chatCompletions = async (messages: Array<{ role: string; content: string }>) => {
  const response = await axios.post(`${BASE_URL}/chat/completions`, {
    model: "deepseek-chat",
    messages,
  }, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  return response.data;
};