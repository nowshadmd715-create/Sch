
import { GoogleGenAI } from "@google/genai";
import { Student } from "../types.ts";

export const getStudentInsight = async (student: Student): Promise<string> => {
  try {
    // Ensuring the API KEY exists before making a call
    if (!process.env.API_KEY) {
      return "Evaluation system is currently offline. Please configure API_KEY in project settings.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a professional, 2-sentence performance evaluation for a student with the following profile:
      Name: ${student.name}
      Class: ${student.className}
      GPA: ${student.gpa}
      Attendance: ${student.attendance}
      Subjects: ${student.subjects.map(s => `${s.name} (${s.grade})`).join(', ')}
      
      Focus on strengths and a small area for improvement. Address it to a parent or guardian.`,
    });
    
    return response.text || "Academic insight is currently generating. Please check back shortly.";
  } catch (error) {
    console.error("Gemini Production Error:", error);
    return "AI insights are currently unavailable due to system traffic. Please try again later.";
  }
};
