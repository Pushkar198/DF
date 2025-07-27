import { pwcGeminiClient } from "./pwc-gemini-client";
import { storage } from "../storage";
import { InsertPrediction, InsertAlert } from "@shared/schema";
import { generateHealthcarePredictions } from "./sectors/healthcare";
import { generateAutomobilePredictions } from "./sectors/automobile";
import { generateAgriculturePredictions } from "./sectors/agriculture";
import { generateRetailPredictions } from "./sectors/retail";
import { generateEnergyPredictions } from "./sectors/energy";

// PwC Gemini client is imported and used in sector-specific modules

export interface SectorDemandForecast {
  sector: 'healthcare' | 'automobile' | 'agriculture' | 'retail' | 'energy';
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
  composition?: string; // For healthcare - active pharmaceutical ingredients
  department?: string;
  category: string;
  subcategory: string;
  currentDemand: number;
  predictedDemand: number;
  demandUnit?: string; // units/month, patients/week, etc.
  demandChange: number;
  demandChangePercentage?: number;
  demandTrend?: string;
  confidence: number;
  peakPeriod: string;
  reasoning: string;
  detailedSources?: string[]; // Specific data sources used
  marketFactors: string[];
  marketFactorData?: {
    environmentalImpact?: number;
    diseasePrevalence?: number;
    healthcareAccess?: number;
    economicAffordability?: number;
    policySupport?: number;
    supplyChainStability?: number;
    clinicalEvidence?: number;
    // For other sectors
    marketDemand?: number;
    seasonalTrends?: number;
    competitionLevel?: number;
    technologyAdoption?: number;
    regulatoryEnvironment?: number;
    consumerSentiment?: number;
    infrastructureReadiness?: number;
  };
  recommendations: string[];
  newsImpact: string;
  seasonalFactor: string;
  riskLevel: string;
}

export async function generateAIDemandForecast(
  sector: 'healthcare' | 'automobile' | 'agriculture' | 'retail' | 'energy',
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
      case 'retail':
        predictions = await generateRetailPredictions(region, timeframe, department, category);
        break;
      case 'energy':
        predictions = await generateEnergyPredictions(region, timeframe, department, category);
        break;
      default:
        throw new Error(`Unsupported sector: ${sector}`);
    }

    // Calculate overall metrics
    const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    
    // Extract market analysis insights
    const marketFactors = Array.from(new Set(predictions.flatMap(p => p.marketFactors)));
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
    // Clear old predictions and alerts for this sector and region
    console.log(`🗑️  Clearing old predictions for ${forecast.sector} in ${forecast.region}...`);
    await storage.clearPredictions(forecast.sector, forecast.region);
    await storage.clearAlerts(forecast.sector, forecast.region);
    
    // Save new predictions
    for (const prediction of forecast.predictions) {
      const predictionData: InsertPrediction = {
        sector: forecast.sector,
        region: forecast.region,
        itemId: null, // Will be assigned by database
        confidence: prediction.confidence,
        timeframe: forecast.timeframe,
        demandLevel: (prediction.demandChangePercentage || 0) > 0 ? 'High' : (prediction.demandChangePercentage || 0) < 0 ? 'Low' : 'Stable',
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

    // Create alerts for high-risk or high-opportunity items (skip healthcare sector)
    if (forecast.sector !== 'healthcare') {
      const highRiskItems = forecast.predictions.filter(p => p.riskLevel === 'High');
      const highOpportunityItems = forecast.predictions.filter(p => (p.demandChangePercentage || 0) > 20);

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
    }

  } catch (error) {
    console.error('Error saving forecast to database:', error);
    throw error;
  }
}