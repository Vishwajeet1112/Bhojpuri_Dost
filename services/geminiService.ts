
import { GoogleGenAI, Content } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface AppMessage {
    role: 'user' | 'ai';
    content: string;
}

export const getBhojpuriResponseStream = async (chatHistory: AppMessage[]) => {
  const systemInstruction = "Tohār kām bā ekdam street-smart, muhphaṭ dost jaisan, hamesha Bhojpuri aur Hindi mix karke javāb deke. Javāb chhoṭ, majedaar, aur full josh me rākhihā. Bindās hoke gali-galoch aur aam bol-chaal ke shabdon ka istemal karā, jaise asli dost log baat karela. English shabdon se dur rahihā. Tohār har javāb Bhojpuri aur Hindi me chāhī.";

  // Map our app's message format to the Gemini API's format
  const contents: Content[] = chatHistory.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model', // Map 'ai' to 'model'
    parts: [{ text: msg.content }],
  }));

  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: contents, // Pass the formatted history
    config: {
      systemInstruction: systemInstruction,
    },
  });

  return stream;
};
