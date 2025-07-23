import { GoogleGenerativeAI } from "@google/genai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface LocationRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  actionItems: string[];
  relevantSectors: string[];
  timeframe: string;
  impactLevel: number; // 1-10 scale
  sources: string[];
}

export interface LocationContext {
  location: string;
  economicProfile: string;
  infrastructure: string;
  demographics: string;
  keyIndustries: string[];
  challenges: string[];
  opportunities: string[];
  recommendations: LocationRecommendation[];
}

/**
 * Generate intelligent location-based recommendations using AI
 * Similar to Google Maps but for demand forecasting insights
 */
export async function generateLocationRecommendations(
  location: string,
  sector?: string
): Promise<LocationContext> {
  const prompt = `You are an expert location analyst providing Google Maps-style intelligent recommendations for demand forecasting and business planning.

LOCATION: ${location}
${sector ? `FOCUS SECTOR: ${sector}` : 'ANALYZE ALL SECTORS: Healthcare, Automobile, Agriculture, Retail, Energy'}

Generate a comprehensive location analysis with actionable recommendations in this exact JSON format:

{
  "location": "${location}",
  "economicProfile": "string (brief economic overview - GDP, income levels, growth trends)",
  "infrastructure": "string (transportation, digital connectivity, logistics capabilities)",
  "demographics": "string (population size, age distribution, education levels, spending patterns)",
  "keyIndustries": ["string (major industries and employers in the region)"],
  "challenges": ["string (key challenges affecting business operations)"],
  "opportunities": ["string (growth opportunities and market gaps)"],
  "recommendations": [
    {
      "category": "string (Market Entry/Supply Chain/Inventory Management/Policy Compliance/etc.)",
      "title": "string (clear, actionable recommendation title)",
      "description": "string (detailed explanation of why this recommendation is important for this location)",
      "priority": "High/Medium/Low",
      "actionItems": ["string (specific steps businesses should take)"],
      "relevantSectors": ["string (which sectors this applies to)"],
      "timeframe": "string (immediate/short-term/long-term)",
      "impactLevel": number (1-10, where 10 is highest business impact),
      "sources": ["string (authoritative sources for this recommendation)"]
    }
  ]
}

LOCATION ANALYSIS REQUIREMENTS:

1. ECONOMIC CONTEXT:
   - Local GDP and economic indicators
   - Income levels and purchasing power
   - Major economic drivers and growth sectors
   - Business environment and ease of doing business

2. INFRASTRUCTURE ASSESSMENT:
   - Transportation networks (roads, railways, airports, ports)
   - Digital connectivity and internet penetration
   - Power supply reliability and energy infrastructure
   - Healthcare and educational infrastructure

3. DEMOGRAPHIC INSIGHTS:
   - Population size and density
   - Age distribution and workforce demographics
   - Education levels and skill availability
   - Consumer behavior and spending patterns

4. SECTOR-SPECIFIC RECOMMENDATIONS:
   ${sector ? `Focus on ${sector} sector with detailed recommendations for:` : 'Provide recommendations for all sectors covering:'}
   - Market entry strategies
   - Supply chain optimization
   - Inventory management approaches
   - Regulatory compliance requirements
   - Partnership opportunities
   - Risk mitigation strategies

5. GOOGLE MAPS-STYLE INTELLIGENCE:
   - Location-specific insights that locals would know
   - Cultural and seasonal factors affecting business
   - Regulatory environment and policy changes
   - Competitive landscape and market saturation
   - Logistics and distribution considerations

6. ACTIONABLE RECOMMENDATIONS:
   Each recommendation must include:
   - Clear business rationale
   - Specific action steps
   - Timeline for implementation
   - Expected impact on operations
   - Relevant authoritative sources

Generate 5-8 comprehensive recommendations covering different aspects of business operations in ${location}.
Focus on insights that would help businesses make informed decisions about demand forecasting, inventory planning, and market strategy.

Provide authoritative sources from government agencies, industry associations, research institutions, and credible business publications.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    const rawJson = response.text;
    if (rawJson) {
      const locationContext = JSON.parse(rawJson);
      return locationContext;
    } else {
      throw new Error("Empty response from Gemini AI");
    }
  } catch (error) {
    console.error('Error generating location recommendations:', error);
    
    // Fallback recommendations for any location
    return {
      location,
      economicProfile: "Mixed economy with growing service and manufacturing sectors",
      infrastructure: "Developing infrastructure with expanding digital connectivity",
      demographics: "Diverse population with growing middle-class consumer base",
      keyIndustries: ["Services", "Manufacturing", "Agriculture", "Trade"],
      challenges: ["Infrastructure gaps", "Regulatory complexity", "Supply chain efficiency"],
      opportunities: ["Digital transformation", "Market expansion", "Policy reforms"],
      recommendations: [
        {
          category: "Market Entry",
          title: "Assess Local Market Demand Patterns",
          description: "Conduct thorough market research to understand local consumer preferences and demand cycles",
          priority: "High",
          actionItems: ["Survey local consumers", "Analyze competitor strategies", "Study seasonal patterns"],
          relevantSectors: ["Healthcare", "Retail", "Automobile"],
          timeframe: "immediate",
          impactLevel: 8,
          sources: ["Local Chamber of Commerce", "Industry associations", "Market research firms"]
        },
        {
          category: "Supply Chain",
          title: "Optimize Distribution Networks",
          description: "Establish efficient supply chain networks leveraging local infrastructure capabilities",
          priority: "High",
          actionItems: ["Map distribution centers", "Partner with local logistics", "Implement inventory management"],
          relevantSectors: ["All sectors"],
          timeframe: "short-term",
          impactLevel: 9,
          sources: ["Logistics industry reports", "Infrastructure ministry data"]
        }
      ]
    };
  }
}

/**
 * Get quick location insights for autocomplete-style suggestions
 */
export async function getLocationInsights(location: string): Promise<{
  economicLevel: string;
  marketPotential: string;
  keyOpportunities: string[];
  primaryChallenges: string[];
}> {
  try {
    const locationContext = await generateLocationRecommendations(location);
    
    return {
      economicLevel: locationContext.economicProfile.split('.')[0], // First sentence
      marketPotential: locationContext.opportunities.length > 0 ? 'High' : 'Medium',
      keyOpportunities: locationContext.opportunities.slice(0, 3),
      primaryChallenges: locationContext.challenges.slice(0, 2)
    };
  } catch (error) {
    console.error('Error getting location insights:', error);
    return {
      economicLevel: "Developing market with growth potential",
      marketPotential: "Medium",
      keyOpportunities: ["Market expansion", "Digital adoption"],
      primaryChallenges: ["Infrastructure development", "Regulatory compliance"]
    };
  }
}