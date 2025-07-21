import { storage } from "../storage";

export async function seedSectorData() {
  console.log("Starting sector data seeding...");
  
  try {
    // Healthcare sector items
    const healthcareItems = [
      { name: "Acetaminophen 500mg", category: "Pharmaceuticals", subcategory: "Pain Management", baselineSupply: 5000, currentPrice: 120 },
      { name: "Amoxicillin 250mg", category: "Pharmaceuticals", subcategory: "Antibiotics", baselineSupply: 3000, currentPrice: 85 },
      { name: "Digital Glucometer", category: "Medical Equipment", subcategory: "Diagnostic Devices", baselineSupply: 800, currentPrice: 1200 },
      { name: "N95 Masks", category: "Medical Supplies", subcategory: "PPE", baselineSupply: 10000, currentPrice: 25 },
      { name: "Insulin Injection", category: "Pharmaceuticals", subcategory: "Diabetes Care", baselineSupply: 1500, currentPrice: 450 }
    ];

    // Automobile sector items
    const automobileItems = [
      { name: "Honda Activa 6G", category: "Two-Wheelers", subcategory: "Scooters", baselineSupply: 200, currentPrice: 75000 },
      { name: "Maruti Swift Dzire", category: "Passenger Vehicles", subcategory: "Compact Sedans", baselineSupply: 150, currentPrice: 600000 },
      { name: "Car Battery", category: "Parts & Accessories", subcategory: "Electrical Parts", baselineSupply: 500, currentPrice: 5500 },
      { name: "Engine Oil 5W-30", category: "Lubricants", subcategory: "Engine Oils", baselineSupply: 2000, currentPrice: 400 },
      { name: "Brake Pads", category: "Parts & Accessories", subcategory: "Braking System", baselineSupply: 800, currentPrice: 1200 }
    ];

    // Agriculture sector items
    const agricultureItems = [
      { name: "Wheat Seeds HD-2967", category: "Seeds", subcategory: "Cereal Seeds", baselineSupply: 5000, currentPrice: 25 },
      { name: "Urea Fertilizer", category: "Fertilizers", subcategory: "Nitrogen Fertilizers", baselineSupply: 8000, currentPrice: 22 },
      { name: "Tractor Mahindra 575 DI", category: "Farm Machinery", subcategory: "Tractors", baselineSupply: 50, currentPrice: 850000 },
      { name: "Drip Irrigation Kit", category: "Irrigation", subcategory: "Drip Systems", baselineSupply: 300, currentPrice: 15000 },
      { name: "Cypermethrin Insecticide", category: "Crop Protection", subcategory: "Insecticides", baselineSupply: 1200, currentPrice: 280 }
    ];

    // Seed healthcare items
    for (const item of healthcareItems) {
      await storage.createDemandItem({
        sector: "healthcare",
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        baselineSupply: item.baselineSupply,
        currentPrice: item.currentPrice
      });
    }

    // Seed automobile items
    for (const item of automobileItems) {
      await storage.createDemandItem({
        sector: "automobile",
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        baselineSupply: item.baselineSupply,
        currentPrice: item.currentPrice
      });
    }

    // Seed agriculture items
    for (const item of agricultureItems) {
      await storage.createDemandItem({
        sector: "agriculture",
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        baselineSupply: item.baselineSupply,
        currentPrice: item.currentPrice
      });
    }

    console.log("Sector data seeding completed successfully");
  } catch (error) {
    console.error("Error seeding sector data:", error);
  }
}