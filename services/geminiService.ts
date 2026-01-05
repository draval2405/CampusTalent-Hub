
import { GoogleGenAI, Type } from "@google/genai";
import { StudentProfile, AIRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getIntelligentMatches = async (
  query: string,
  profiles: StudentProfile[]
): Promise<AIRecommendation[]> => {
  const model = "gemini-3-flash-preview";
  
  // Format profiles for context
  const profilesContext = profiles.map(p => ({
    name: p.name,
    headline: p.headline,
    skills: p.skills,
    experience_level: p.experience_level,
    projects: p.projects.map(proj => proj.title),
    availability: p.availability
  }));

  const systemInstruction = `
    You are the AI intelligence layer of "CampusTalent Hub".
    Your task: Match students from the provided list to a user's natural language search query.
    
    RULES:
    1. NEVER fabricate data. Use ONLY the profiles provided in the context.
    2. Normalize skills (e.g., "reactjs" to "React", "ml" to "Machine Learning").
    3. Be honest. If a student is missing a key skill requested, mention it in "match_reason".
    4. Rank results by relevance (skill alignment, experience, availability).
    5. Return a JSON array of recommendation objects.

    FORMAT:
    {
      "name": string,
      "headline": string,
      "skills": string[],
      "experience_level": string,
      "projects": string[],
      "availability": string,
      "match_reason": string
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: `User Query: "${query}"\n\nStudent Database:\n${JSON.stringify(profilesContext)}` }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              headline: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              experience_level: { type: Type.STRING },
              projects: { type: Type.ARRAY, items: { type: Type.STRING } },
              availability: { type: Type.STRING },
              match_reason: { type: Type.STRING }
            },
            required: ["name", "headline", "skills", "experience_level", "projects", "availability", "match_reason"]
          }
        }
      }
    });

    if (!response.text) return [];
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Match Error:", error);
    return [];
  }
};

export const normalizeSummary = async (rawText: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const prompt = `Convert the following raw student bio into a professional, concise, industry-standard summary for a technical collaboration platform. Focus on technical clarity and punchy delivery. Do not invent new skills.\n\nRaw Text: "${rawText}"`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ text: prompt }],
      config: {
        systemInstruction: "You are a professional technical editor. Maintain a high-quality LinkedIn-style tone.",
      }
    });
    return response.text || rawText;
  } catch (error) {
    return rawText;
  }
};
