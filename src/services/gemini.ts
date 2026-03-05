import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Initialize Gemini API
// Note: In a real production app, we should be careful about exposing keys, 
// but for this preview environment, process.env.GEMINI_API_KEY is injected safely.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  // Fast response for micro-interactions
  async getFastFeedback(answer: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: `Act as a witty, empathetic relationship coach. Give a very short (max 10 words), fun reaction to this answer in a couples quiz: "${answer}". Keep it playful.`,
      });
      return response.text;
    } catch (error) {
      console.error("Fast feedback error:", error);
      return "¡Interesante!";
    }
  },

  // Generate adaptive questions
  async generateQuestions(stage: string, previousAnswers: any[]) {
    try {
      const prompt = `
        Generate 3 engaging couples quiz questions for a relationship at the "${stage}" stage.
        Categories: Personality, Dreams, Fears, Humor, Habits, Memories.
        Previous context: ${JSON.stringify(previousAnswers)}.
        Return ONLY a JSON array of objects with keys: id (unique string), category, text, type (always 'text' for now).
        Language: Spanish.
        Tone: Fun, deep, curious.
      `;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      
      return JSON.parse(response.text || "[]");
    } catch (error) {
      console.error("Question generation error:", error);
      return [];
    }
  },

  // Generate a single trending question using Google Search
  async generateTrendingQuestion() {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Find a current trending TV show, movie, or viral topic from this week. Then generate a couples quiz question about it (e.g., 'Would we survive in The Last of Us?'). Return JSON: { id: 'trend1', category: 'Tendencias', text: '...' }",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Trending question error:", error);
      return null;
    }
  },

  // Cupid Chatbot
  async chatWithCupid(message: string, context: any) {
    try {
      const chat = ai.chats.create({
        model: "gemini-3.1-pro-preview",
        config: {
          systemInstruction: "Eres Cúpido IA, un asistente divertido, empático y moderno para una app de parejas. Ayudas a aclarar preguntas, mediar desacuerdos ligeros y dar consejos breves. Tu tono es amigable, un poco pícaro pero respetuoso. Hablas español.",
        }
      });
      
      const result = await chat.sendMessage({ message: `Contexto del quiz: ${JSON.stringify(context)}. Usuario dice: ${message}` });
      return result.text;
    } catch (error) {
      console.error("Cupid chat error:", error);
      return "¡Ups! Mis flechas se cruzaron. ¿Podrías repetirlo?";
    }
  },

  // Final Analysis (Thinking Mode)
  async generateCompatibilityReport(answers: any[]) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `
          Analyze these couples quiz answers and generate a compatibility report.
          Answers: ${JSON.stringify(answers)}
          
          Output JSON with:
          - score (0-100 integer)
          - badge (string, e.g., "Almas Gemelas", "Dúo Dinámico")
          - summary (string, 2 paragraphs, empathetic and insightful analysis of their dynamic)
          - strengths (array of strings)
          - growthAreas (array of strings)
          
          Use ThinkingLevel.HIGH for deep psychological insight.
        `,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          responseMimeType: "application/json"
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Report generation error:", error);
      return null;
    }
  },

  // TTS for Report
  async speakText(text: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Fenrir" } // Warm, deep voice
            }
          }
        }
      });
      
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return audioData; // Base64 string
    } catch (error) {
      console.error("TTS error:", error);
      return null;
    }
  }
};
