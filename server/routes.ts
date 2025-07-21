import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generatePredictionsForRegion, getPredictionMetrics } from "./services/prediction";
import { seedSectorData } from "./services/sector-seeding";
import { analyzeMedicineRecommendations, generateInsights } from "./services/gemini";
import { InsertEnvironmentalData } from "@shared/schema";
import { fetchRealEnvironmentalData, fetchRealDiseaseData, fetchRealHealthData, getAvailableRegions, getRegionInfo } from "./services/real-data";
import { fetchRealTimeNews, fetchSocialMediaTrends, fetchWeatherData, fetchHospitalData, fetchDemographicData, fetchComprehensiveRegionData } from "./services/external-data";
import { fetchRealWeatherData, fetchRealNewsData, fetchRealSocialMediaData, fetchRealHospitalData, fetchRealDemographicData } from "./services/weather-api";
import { generateComprehensivePredictions, savePredictionResults } from "./services/comprehensive-prediction";
import { generateSectorDemandForecast } from "./services/multi-sector-prediction";
import { generateAIDemandForecast } from "./services/ai-demand-forecasting";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed initial data
  await seedSectorData();

  // Dashboard metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const region = req.query.region as string;
      const metrics = await getPredictionMetrics(region);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to get metrics" });
    }
  });

  // Get predictions for a region and sector
  app.get("/api/predictions", async (req, res) => {
    try {
      const region = req.query.region as string;
      const sector = req.query.sector as string;
      const predictions = await storage.getPredictions(sector, region);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get predictions" });
    }
  });

  // Get demand items for a sector
  app.get("/api/demand-items", async (req, res) => {
    try {
      const sector = req.query.sector as string;
      const demandItems = await storage.getDemandItems(sector);
      res.json(demandItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to get demand items" });
    }
  });

  // Get alerts for a sector
  app.get("/api/alerts", async (req, res) => {
    try {
      const sector = req.query.sector as string;
      const alerts = await storage.getAlerts(undefined, sector);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get alerts" });
    }
  });

  // Get sectors
  app.get("/api/sectors", async (req, res) => {
    try {
      const sectors = await storage.getSectors();
      res.json(sectors);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sectors" });
    }
  });

  // Get real-time data status for a sector and region
  app.get("/api/real-time-status", async (req, res) => {
    try {
      const { sector, region } = req.query;
      if (!sector || !region) {
        return res.status(400).json({ error: "Sector and region are required" });
      }

      // Import here to avoid circular dependency
      const { getRealTimeData } = await import("./services/real-time-data");
      const realTimeData = await getRealTimeData(sector as string, region as string);
      
      res.json({
        dataSourcesStatus: {
          weather: { status: "connected", source: realTimeData.weather.source },
          market: { status: "connected", source: realTimeData.marketTrends.source },
          news: { status: "connected", source: realTimeData.newsData.source },
          economic: { status: "connected", source: realTimeData.economicIndicators.source },
          social: { status: "connected", source: realTimeData.socialSentiment.source }
        },
        lastUpdated: new Date().toISOString(),
        region: region,
        sector: sector
      });
    } catch (error) {
      console.error('Error fetching real-time status:', error);
      res.status(500).json({ error: "Failed to get real-time data status" });
    }
  });

  // Generate AI-driven real-time demand predictions
  app.post("/api/predictions/generate", async (req, res) => {
    try {
      const { sector, region, timeframe } = req.body;
      if (!sector || !region) {
        return res.status(400).json({ error: "Sector and region are required" });
      }

      console.log(`🚀 Starting AI demand forecast for ${sector} in ${region}...`);
      
      // Use comprehensive AI-driven forecasting with real-time data
      const forecast = await generateAIDemandForecast(
        sector,
        region,
        timeframe || "30 days"
      );

      res.json({ 
        success: true, 
        forecast,
        message: `AI analysis complete using ${forecast.dataSourcesUsed.join(', ')} data sources`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error generating AI predictions:', error);
      res.status(500).json({ error: "Failed to generate AI predictions" });
    }
  });



  // Get available regions (Indian cities with sample data)
  app.get("/api/regions", async (req, res) => {
    try {
      const { INDIAN_CITIES } = await import('./services/india-sample-data');
      res.json({ 
        regions: INDIAN_CITIES,
        message: "Available Indian cities with realistic sample data",
        count: INDIAN_CITIES.length 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get regions" });
    }
  });

  // Get diseases
  app.get("/api/diseases", async (req, res) => {
    try {
      const diseases = await storage.getDiseases();
      res.json(diseases);
    } catch (error) {
      res.status(500).json({ error: "Failed to get diseases" });
    }
  });

  // Medicines are now generated by AI predictions only - no database fetching
  app.get("/api/medicines", async (req, res) => {
    res.json([]);
  });

  // Get alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to get alerts" });
    }
  });

  // Mark alert as read
  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markAlertAsRead(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark alert as read" });
    }
  });

  // Get real-time environmental data
  app.get("/api/environmental", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      // Fetch real-time environmental data
      const realData = await fetchRealEnvironmentalData(region);
      
      // Store in database for caching
      let existingData = await storage.getEnvironmentalData(region);
      if (!existingData) {
        const environmentalData: InsertEnvironmentalData = {
          region,
          temperature: realData.temperature,
          humidity: realData.humidity,
          airQuality: realData.airQuality,
          populationDensity: realData.populationDensity,
          data: {
            windSpeed: realData.windSpeed,
            precipitation: realData.precipitation,
            uvIndex: realData.uvIndex,
            pressure: realData.pressure,
            visibility: realData.visibility,
            dewPoint: realData.dewPoint
          }
        };
        existingData = await storage.createEnvironmentalData(environmentalData);
      }
      
      res.json(realData);
    } catch (error) {
      console.error("Error fetching real environmental data:", error);
      res.status(500).json({ error: "Failed to get environmental data" });
    }
  });

  // Get reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reports" });
    }
  });

  // Get available regions
  app.get("/api/regions", async (req, res) => {
    try {
      const regions = getAvailableRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get regions" });
    }
  });

  // Get region info
  app.get("/api/regions/:region", async (req, res) => {
    try {
      const region = req.params.region;
      const info = getRegionInfo(region);
      if (!info) {
        return res.status(404).json({ error: "Region not found" });
      }
      res.json({ region, ...info });
    } catch (error) {
      res.status(500).json({ error: "Failed to get region info" });
    }
  });

  // Get real-time disease data
  app.get("/api/diseases/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const diseaseData = await fetchRealDiseaseData(region);
      res.json(diseaseData);
    } catch (error) {
      console.error("Error fetching real disease data:", error);
      res.status(500).json({ error: "Failed to get real-time disease data" });
    }
  });

  // Get real-time health data
  app.get("/api/health/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const healthData = await fetchRealHealthData(region);
      res.json(healthData);
    } catch (error) {
      console.error("Error fetching real health data:", error);
      res.status(500).json({ error: "Failed to get real-time health data" });
    }
  });

  // Get real-time news data
  app.get("/api/news/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const newsData = await fetchRealTimeNews(region);
      res.json(newsData);
    } catch (error) {
      console.error("Error fetching real news data:", error);
      res.status(500).json({ error: "Failed to get real-time news data" });
    }
  });

  // Get real-time social media trends
  app.get("/api/social/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const socialData = await fetchSocialMediaTrends(region);
      res.json(socialData);
    } catch (error) {
      console.error("Error fetching social media data:", error);
      res.status(500).json({ error: "Failed to get social media trends" });
    }
  });

  // Get real-time weather data
  app.get("/api/weather/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const weatherData = await fetchWeatherData(region);
      res.json(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      res.status(500).json({ error: "Failed to get weather data" });
    }
  });

  // Get real-time hospital data
  app.get("/api/hospitals/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const hospitalData = await fetchHospitalData(region);
      res.json(hospitalData);
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      res.status(500).json({ error: "Failed to get hospital data" });
    }
  });

  // Get real-time demographic data
  app.get("/api/demographics/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const demographicData = await fetchDemographicData(region);
      res.json(demographicData);
    } catch (error) {
      console.error("Error fetching demographic data:", error);
      res.status(500).json({ error: "Failed to get demographic data" });
    }
  });

  // Get comprehensive real-time data for a region
  app.get("/api/comprehensive/realtime", async (req, res) => {
    try {
      const region = req.query.region as string;
      if (!region) {
        return res.status(400).json({ error: "Region is required" });
      }
      
      const comprehensiveData = await fetchComprehensiveRegionData(region);
      res.json(comprehensiveData);
    } catch (error) {
      console.error("Error fetching comprehensive data:", error);
      res.status(500).json({ error: "Failed to get comprehensive data" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/metrics", async (req, res) => {
    try {
      const totalPredictions = (await storage.getPredictions()).length;
      const alerts = await storage.getAlerts();
      const highRiskAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high').length;
      
      const metrics = {
        totalPredictions,
        activeRegions: 24,
        highRiskAlerts,
        systemUptime: 99.9
      };
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching admin metrics:", error);
      res.status(500).json({ error: "Failed to fetch admin metrics" });
    }
  });

  app.get("/api/admin/predictions", async (req, res) => {
    try {
      const { timeframe } = req.query;
      const predictions = await storage.getPredictions();
      res.json(predictions);
    } catch (error) {
      console.error("Error fetching admin predictions:", error);
      res.status(500).json({ error: "Failed to fetch admin predictions" });
    }
  });

  app.get("/api/admin/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching admin alerts:", error);
      res.status(500).json({ error: "Failed to fetch admin alerts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
