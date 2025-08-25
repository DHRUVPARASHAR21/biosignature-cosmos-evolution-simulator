
import { GoogleGenAI } from "@google/genai";
import type { EvolutionChange } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getEvolutionExplanation = async (
  originalSequence: string,
  evolvedSequence: string,
  changes: EvolutionChange[],
  environment: string,
  years: number
): Promise<string> => {
    const prompt = `Given an original amino acid sequence, its evolved counterpart after ${years} years in a ${environment} environment, and a list of specific changes, provide a concise explanation of the most significant evolutionary adaptations.

  Format the response using markdown headings (## for main sections, ### for sub-sections) and crisp bullet points (- ). Strictly avoid paragraphs. Each content point must be a one or two-liner at most. Do not use bold markdown (**) for headings or any other text.

  Include a comparative table in markdown format directly under each main heading, summarizing how key characteristics of the organism change. The table should have columns for "Characteristic", "Original State", and "Evolved State".

  ## Overall Adaptive Strategy
  Describe the main evolutionary strategy. Include a table here.
  | Characteristic          | Original State          | Evolved State            |
  |-------------------------|-------------------------|--------------------------|
  | Survival Priority       | Basic functions         | Extreme adaptation       |
  | Key Challenge           | Standard Earth threats  | [Environment Specific]   |
  | Primary Mechanism       | Standard metabolism     | [Environment Specific]   |
  - Overall strategy pointer 1
  - Overall strategy pointer 2

  ## Potential Visual Manifestations
  Describe how these genetic adaptations might visually manifest. Include a table here.
  | Feature                 | Original Appearance     | Evolved Appearance       |
  |-------------------------|-------------------------|--------------------------|
  | Color/Hue               | [Neutral/Earthly]       | [Environment Specific]   |
  | Texture/Surface         | Smooth/Typical          | [Environment Specific]   |
  | Aura/Glow               | None                    | [Environment Specific]   |
  | General Shape           | Humanoid                | [Slightly Altered]       |
  - Visual pointer 1
  - Visual pointer 2

  ## Key Genetic Adaptations (Summary)
  Summarize the genetic changes and their benefits. Include a table here.
  | Adaptation Focus        | Original Gene State     | Evolved Gene State       |
  |-------------------------|-------------------------|--------------------------|
  | Protein Stability       | Standard                | Enhanced for [Temp/Pressure] |
  | Membrane Composition    | Typical phospholipids   | [Altered for environment] |
  | DNA Repair              | Baseline                | Boosted for [Radiation]  |
  | Metabolic Pathway       | Earth-based             | [New/Modified pathway]   |
  - Genetic pointer 1
  - Genetic pointer 2

  Original sequence (excerpt): ${originalSequence.substring(0, 50)}...
  Evolved sequence (excerpt): ${evolvedSequence.substring(0, 50)}...
  Total changes simulated: ${changes.length}

  Here are some key changes and their simulated reasons:
  ${changes.slice(0, 5).map(c => `- Position ${c.index + 1}: ${c.original} -> ${c.evolved} (Reason: ${c.reason})`).join('\n')}
  ${changes.length > 5 ? `...and ${changes.length - 5} more changes.` : ''}

  ---

  Provide a short, 2-liner layman's pointer at the very end of your explanation, after a horizontal rule.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Failed to get a detailed explanation due to an API error. Please check the console for details.";
  }
};
