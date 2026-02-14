
import { GoogleGenAI } from "@google/genai";
import { SOAPNote, Encounter } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getSOAPAssistant(note: SOAPNote): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional medical assistant. Analyze the following SOAP note and suggest a refined Plan or potential Differential Diagnoses. Use professional medical terminology but keep it concise.
      Subjective: ${note.subjective}
      Objective: ${note.objective}
      Assessment: ${note.assessment}
      `,
    });
    return response.text || "No suggestions available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error getting medical assistance.";
  }
}

export async function getDashboardInsights(encounters: Encounter[]): Promise<string> {
  try {
    const prompt = `Analyze these ${encounters.length} patient encounters and provide a brief summary of operational trends (status distribution, top departments). 
    Keep it to 2-3 bullet points. Data: ${JSON.stringify(encounters.map(e => ({ dep: e.department, status: e.status })))}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Trends stable.";
  } catch (error) {
    return "Insights unavailable.";
  }
}
