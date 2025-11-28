import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const improveContent = async (currentContent: string, instruction: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are an expert technical writer and LaTeX specialist.
      
      Task: Edit or generate Markdown content based on the user's instruction.
      
      Context (Current Document Content):
      """
      ${currentContent.substring(0, 10000)}
      """
      
      User Instruction: "${instruction}"
      
      Requirements:
      1. Return ONLY the new or modified Markdown content.
      2. Keep existing LaTeX formatting (e.g., $E=mc^2$) intact.
      3. Do not include markdown code fences (like \`\`\`markdown) in the output unless it's part of the document itself.
      4. If the instruction is to "continue writing", append logically to the context.
      5. If the instruction is "fix grammar", output the corrected version of the context.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text;
    return text || currentContent;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check your API key or try again.");
  }
};
