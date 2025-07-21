import { GoogleGenAI } from "@google/genai";
import { storage } from "../storage";
import { InsertPrediction, InsertAlert } from "@shared/schema";
import { generateHealthcarePredictions } from "./sectors/healthcare";
import { generateAutomobilePredictions } from "./sectors/automobile";
import { generateAgriculturePredictions } from "./sectors/agriculture";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "AIzaSyD_fPFEGtS73QS4E1HqEcyAweGGa-qglZI"
});

export interface SectorDemandForecast {
  sector: 'healthcare' | 'automobile' | 'agriculture';
  region: string;
  timeframe: string;
  predictions: DemandPrediction[];
  confidence: number;
  dataSourcesUsed: string[];
  marketAnalysis: string;
  riskFactors: string[];
  opportunities: string[];
}

export interface DemandPrediction {
  itemName: string;
  category: string;
  subcategory: string;
  currentDemand: number;
  predictedDemand: number;
  demandChange: number;
  confidence: number;
  peakPeriod: string;
  reasoning: string;
  marketFactors: string[];
  recommendations: string[];
  newsImpact: string;
  seasonalFactor: string;
  riskLevel: string;
}

export async function generateAIDemandForecast(
  sector: 'healthcare' | 'automobile' | 'agriculture',
  region: string,
  timeframe: string = "30 days",
  department?: string,
  category?: string
): Promise<SectorDemandForecast> {
  
  console.log(`🚀 Starting AI demand forecast for ${sector} in ${region}...`);

  // Generate sector-specific predictions using enhanced AI modules
  let predictions: DemandPrediction[] = [];
  
  try {
    switch (sector) {
      case 'healthcare':
        predictions = await generateHealthcarePredictions(region, timeframe, department, category);
        break;
      case 'automobile':
        predictions = await generateAutomobilePredictions(region, timeframe, department, category);
        break;
      case 'agriculture':
        predictions = await generateAgriculturePredictions(region, timeframe, department, category);
        break;
      default:
        throw new Error(`Unsupported sector: ${sector}`);
    }

    // Calculate overall metrics
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    
    // Extract market analysis insights
    const marketFactors = [...new Set(predictions.flatMap(p => p.marketFactors))];
    const riskFactors = predictions.filter(p => p.riskLevel === 'High').map(p => p.itemName);
    const opportunities = predictions.filter(p => p.demandChange > 10).map(p => p.itemName);

    const forecast: SectorDemandForecast = {
      sector,
      region,
      timeframe,
      predictions,
      confidence: avgConfidence,
      dataSourcesUsed: ['Gemini AI', 'Real-time market data', 'News integration', 'Weather API'],
      marketAnalysis: `Professional ${sector} demand forecast with ${predictions.length} specific predictions for ${region}`,
      riskFactors,
      opportunities
    };

    // Save to database
    console.log(`💾 Saving ${predictions.length} predictions to database...`);
    await saveForecastToDatabase(forecast);
    console.log(`✅ Successfully saved forecast for ${sector} sector`);

    return forecast;

  } catch (error) {
    console.error(`Error generating ${sector} forecast:`, error);
    throw new Error(`Failed to generate ${sector} demand forecast: ${error}`);
  }
}

async function saveForecastToDatabase(forecast: SectorDemandForecast): Promise<void> {
  try {
    // Save predictions
    for (const prediction of forecast.predictions) {
      const predictionData: InsertPrediction = {
        sector: forecast.sector,
        region: forecast.region,
        itemId: null, // Will be assigned by database
        confidence: prediction.confidence,
        timeframe: forecast.timeframe,
        demandLevel: prediction.demandChangePercentage > 0 ? 'High' : prediction.demandChangePercentage < 0 ? 'Low' : 'Stable',
        demandQuantity: Math.round(prediction.predictedDemand),
        environmentalFactors: {
          seasonalFactor: prediction.seasonalFactor,
          marketFactors: prediction.marketFactors
        },
        marketFactors: {
          newsImpact: prediction.newsImpact,
          recommendations: prediction.recommendations,
          riskLevel: prediction.riskLevel
        },
        aiAnalysis: prediction.reasoning
      };

      await storage.createPrediction(predictionData);
    }

    // Create alerts for high-risk or high-opportunity items
    const highRiskItems = forecast.predictions.filter(p => p.riskLevel === 'High');
    const highOpportunityItems = forecast.predictions.filter(p => p.demandChangePercentage > 20);

    for (const item of [...highRiskItems, ...highOpportunityItems]) {
      const alertData: InsertAlert = {
        sector: forecast.sector,
        region: forecast.region,
        title: `${item.riskLevel} Risk: ${item.itemName}`,
        alertType: item.riskLevel === 'High' ? 'supply_shortage' : 'demand_surge',
        severity: item.riskLevel === 'High' ? 'high' : 'medium',
        message: `${item.itemName}: ${item.reasoning}`,
        isResolved: false,
        itemName: item.itemName
      };

      await storage.createAlert(alertData);
    }

  } catch (error) {
    console.error('Error saving forecast to database:', error);
    throw error;
  }
}