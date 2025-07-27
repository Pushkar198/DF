/**
 * PwC Gemini 2.0 Flash API Client
 * Centralized client for accessing PwC's Gemini API endpoint
 */

export interface GeminiRequest {
  model: string;
  prompt: string;
  presence_penalty: number;
  seed: number;
  stop: null;
  stream: boolean;
  stream_options: null;
  temperature: number;
  top_p: number;
}

export interface GeminiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    finish_reason: string;
    index: number;
    text: string;
    logprobs: null;
  }>;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
    completion_tokens_details: null;
    prompt_tokens_details: {
      audio_tokens: null;
      cached_tokens: null;
    };
  };
}

class PwCGeminiClient {
  private apiKey: string;
  private baseUrl: string = "https://genai-sharedservice-americas.pwc.com/completions";

  constructor() {
    this.apiKey = process.env.PWC_API_KEY || "";
    if (!this.apiKey) {
      throw new Error("PWC_API_KEY environment variable is required");
    }
  }

  async generateContent(prompt: string): Promise<string> {
    const requestBody: GeminiRequest = {
      model: "vertex_ai.gemini-2.0-flash",
      prompt: prompt,
      presence_penalty: 0,
      seed: 25,
      stop: null,
      stream: false,
      stream_options: null,
      temperature: 1,
      top_p: 1
    };

    try {
      console.log("PwC API Request:", JSON.stringify(requestBody, null, 2));
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "API-Key": this.apiKey,
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PwC Gemini API error: ${response.status} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      console.log("PwC Gemini API Response:", JSON.stringify(data, null, 2));
      
      if (!data.choices || !data.choices[0] || typeof data.choices[0].text !== 'string') {
        console.error("Invalid PwC Gemini API response structure:", {
          hasChoices: !!data.choices,
          hasFirstChoice: !!(data.choices && data.choices[0]),
          hasText: !!(data.choices && data.choices[0] && data.choices[0].text),
          textType: data.choices && data.choices[0] ? typeof data.choices[0].text : 'undefined',
          fullResponse: data
        });
        throw new Error("Invalid response format from PwC Gemini API");
      }

      return data.choices[0].text;
    } catch (error) {
      console.error("PwC Gemini API error:", error);
      throw error;
    }
  }

  async generateJSON(prompt: string): Promise<any> {
    const jsonPrompt = `${prompt}\n\nIMPORTANT: Return only valid JSON in your response, no other text, markdown formatting, or code blocks.`;
    const response = await this.generateContent(jsonPrompt);
    
    try {
      // Clean up the response by removing markdown code blocks
      let cleanResponse = response.trim();
      
      // Remove ```json and ``` markers if present
      cleanResponse = cleanResponse.replace(/^```json\s*/i, '');
      cleanResponse = cleanResponse.replace(/^```\s*/, '');
      cleanResponse = cleanResponse.replace(/\s*```$/, '');
      cleanResponse = cleanResponse.trim();
      
      // Extract JSON from response if it contains other text
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return JSON.parse(cleanResponse);
      }
    } catch (error) {
      console.error("Failed to parse JSON from PwC Gemini response:", {
        originalResponse: response,
        cleanedResponse: response.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim(),
        error: error
      });
      throw new Error("Invalid JSON response from PwC Gemini API");
    }
  }
}

// Export singleton instance
export const pwcGeminiClient = new PwCGeminiClient();