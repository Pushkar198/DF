import { storage } from "../storage";
import { healthcareItems } from "./sectors/healthcare";
import { automobileItems } from "./sectors/automobile";
import { agricultureItems } from "./sectors/agriculture";

export async function seedInitialSectorData(): Promise<void> {
  try {
    console.log("Starting sector data seeding...");

    // Create sectors
    const sectors = [
      {
        name: "healthcare",
        displayName: "Healthcare",
        description: "Healthcare demand forecasting including medicines, medical equipment, and healthcare services",
        isActive: true
      },
      {
        name: "automobile",
        displayName: "Automobile",
        description: "Vehicle demand forecasting including cars, bikes, commercial vehicles, and related services",
        isActive: true
      },
      {
        name: "agriculture",
        displayName: "Agriculture",
        description: "Agricultural demand forecasting including seeds, fertilizers, machinery, and pesticides",
        isActive: true
      }
    ];

    // Seed sectors
    for (const sectorData of sectors) {
      const existingSector = await storage.getSectorByName(sectorData.name);
      if (!existingSector) {
        await storage.createSector(sectorData);
        console.log(`Created sector: ${sectorData.displayName}`);
      }
    }

    // Seed healthcare items
    for (const item of healthcareItems) {
      const existingItem = await storage.getDemandItemsByCategory("healthcare", item.category);
      const itemExists = existingItem.some(existing => existing.name === item.name);
      if (!itemExists) {
        await storage.createDemandItem({
          sector: "healthcare",
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          specifications: item.specifications,
          description: `Healthcare item: ${item.name}`,
          seasonalPattern: item.specifications?.seasonal || "year-round",
          factors: ["demand", "supply", "weather", "epidemic"]
        });
      }
    }

    // Seed automobile items
    for (const item of automobileItems) {
      const existingItem = await storage.getDemandItemsByCategory("automobile", item.category);
      const itemExists = existingItem.some(existing => existing.name === item.name);
      if (!itemExists) {
        await storage.createDemandItem({
          sector: "automobile",
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          specifications: item.specifications,
          description: `Automobile item: ${item.name}`,
          seasonalPattern: "year-round",
          factors: ["fuel_prices", "policy", "economy", "weather"]
        });
      }
    }

    // Seed agriculture items
    for (const item of agricultureItems) {
      const existingItem = await storage.getDemandItemsByCategory("agriculture", item.category);
      const itemExists = existingItem.some(existing => existing.name === item.name);
      if (!itemExists) {
        await storage.createDemandItem({
          sector: "agriculture",
          name: item.name,
          category: item.category,
          subcategory: item.subcategory,
          specifications: item.specifications,
          description: `Agriculture item: ${item.name}`,
          seasonalPattern: item.specifications?.cropCycle || "seasonal",
          factors: ["weather", "monsoon", "soil", "market_price"]
        });
      }
    }

    console.log("Sector data seeding completed successfully");
  } catch (error) {
    console.error("Error seeding sector data:", error);
    throw error;
  }
}