import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { PRODUCTS, CURRENCY_SYMBOL } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Prepare product context for the AI
const productContext = PRODUCTS.map(p => 
  `- ${p.name} (${p.category}): ${CURRENCY_SYMBOL}${p.price} - ${p.description}`
).join('\n');

const systemInstruction = `
You are "Thandi", a helpful and friendly AI shopping assistant for "SouthStore", a South African online supermarket.
Your tone should be warm, professional, and locally relevant (you can use occasional South African colloquialisms like "Howzit", "Sharp", "Eish" if appropriate for the context, but keep it professional).

We sell Clothing, Hardware, Home goods, and Electronics.
Specifically, we have these products in stock:
${productContext}

Your goal is to:
1. Help customers find products based on their needs.
2. Suggest items for specific scenarios (e.g., "Load shedding" -> Suggest the LED Lantern or Gas Stove).
3. Provide price info in Rand (${CURRENCY_SYMBOL}).
4. If a user asks about a product we don't have, politely suggest the closest alternative or say we don't stock it yet.
5. Keep answers concise (under 100 words) unless detailed comparison is asked.

Do not invent products that are not in the list above.
`;

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7, 
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    initializeChat();
  }

  if (!chatSession) {
    return "Sorry, I'm having trouble connecting to the server right now. Please check your API key.";
  }

  try {
    const response = await chatSession.sendMessageStream({ message });
    let fullText = "";
    for await (const chunk of response) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        fullText += c.text;
      }
    }
    return fullText;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Eish! Something went wrong. Please try asking again.";
  }
};