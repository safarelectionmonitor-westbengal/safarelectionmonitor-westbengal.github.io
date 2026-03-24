import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getConstituencyData() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: "Provide a JSON array of all 294 constituencies for the 2021 West Bengal Assembly Election. Each object should have: id (1-294), name, district, winner, party, margin (number), and runnerUp. Ensure the data is accurate for the 2021 results.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            name: { type: Type.STRING },
            district: { type: Type.STRING },
            winner: { type: Type.STRING },
            party: { type: Type.STRING },
            margin: { type: Type.INTEGER },
            runnerUp: { type: Type.STRING }
          },
          required: ["id", "name", "district", "winner", "party", "margin", "runnerUp"]
        }
      }
    }
  });

  console.log(response.text);
}

getConstituencyData();
