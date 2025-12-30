
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Interface for the technical assistant interaction.
 * Uses Gemini 3 Flash for efficient and accurate technical clinical engineering responses.
 */
export async function askTechnicalAssistant(prompt: string): Promise<string> {
  try {
    // Initializing Gemini client with named parameter for security and configuration consistency
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Explicitly typing the response as GenerateContentResponse
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é um Assistente Sênior de Engenharia Clínica em um ambiente hospitalar. 
        Suas respostas devem ser técnicas, precisas, profissionais e focadas em normas brasileiras (ANVISA, ABNT). 
        Ajude com dúvidas sobre manutenção, calibração, normas técnicas (NBR IEC 60601) e gestão hospitalar.`,
        temperature: 0.7,
      },
    });
    
    // Direct access to .text property as per the latest SDK property access guidelines
    return response.text || "Desculpe, não consegui processar sua dúvida agora.";
  } catch (error) {
    console.error("AI Technical Assistant Error:", error);
    return "Erro ao conectar com o assistente técnico. Verifique sua conexão.";
  }
}
