import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const geminiResponse = async (
  promptUser,
  assistantName,
  userName
) => {
  try {
    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You behave like a voice-enabled assistant.

Respond ONLY with valid JSON.

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" |
          "get-time" | "get-date" | "get-day" | "get-month" |
          "calculator-open" | "instagram-open" |
          "facebook-open" | "weather-show",

  "userInput": "<processed user input>",
  "response": "<short spoken response>"
}

Rules:
- Remove assistant name from userInput.
- For Google/YouTube search return only search query.
- If user asks who created you:
  "I am a virtual assistant created by ${userName}"
- Return ONLY JSON.

User Input:
${promptUser}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(
      "Gemini Error:",
      error?.message || error
    );
    throw error;
  }
};

export default geminiResponse;
