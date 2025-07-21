import { storage } from "../storage";

export async function seedSectorData() {
  console.log("Starting sector data seeding...");
  
  try {
    // Healthcare sector items with departments
    const healthcareItems = [
      { name: "Acetaminophen 500mg", department: "Emergency Department", category: "Medicines", subcategory: "Pain Management", baselineSupply: 5000, currentPrice: 120 },
      { name: "Amoxicillin 250mg", department: "General Medicine", category: "Medicines", subcategory: "Antibiotics", baselineSupply: 3000, currentPrice: 85 },
      { name: "Digital Glucometer", department: "Endocrinology Department", category: "Diagnostic Kits", subcategory: "Diagnostic Devices", baselineSupply: 800, currentPrice: 1200 },
      { name: "N95 Masks", department: "Emergency Department", category: "Patient Care Items", subcategory: "PPE", baselineSupply: 10000, currentPrice: 25 },
      { name: "Insulin Injection", department: "Endocrinology Department", category: "Medicines", subcategory: "Diabetes Care", baselineSupply: 1500, currentPrice: 450 },
      { name: "Blood Test Kit", department: "Laboratory Department", category: "Test Kits", subcategory: "Blood Tests", baselineSupply: 2000, currentPrice: 350 },
      { name: "ECG Machine", department: "Cardiac Department", category: "Medical Equipment", subcategory: "Monitors", baselineSupply: 50, currentPrice: 125000 },
      { name: "Ventilator", department: "Intensive Care Unit", category: "Medical Equipment", subcategory: "Ventilators", baselineSupply: 25, currentPrice: 850000 }
    ];

    // Automobile sector items with departments
    const automobileItems = [
      { name: "Honda Activa 6G", department: "Sales Department", category: "Vehicles", subcategory: "2-Wheeler", baselineSupply: 200, currentPrice: 75000 },
      { name: "Maruti Swift Dzire", department: "Sales Department", category: "Vehicles", subcategory: "4-Wheeler", baselineSupply: 150, currentPrice: 600000 },
      { name: "Car Battery", department: "Parts Department", category: "Spare Parts", subcategory: "Electrical Parts", baselineSupply: 500, currentPrice: 5500 },
      { name: "Engine Oil 5W-30", department: "Service Department", category: "Accessories", subcategory: "Engine Oils", baselineSupply: 2000, currentPrice: 400 },
      { name: "Brake Pads", department: "Parts Department", category: "Spare Parts", subcategory: "Braking System", baselineSupply: 800, currentPrice: 1200 },
      { name: "Diagnostic Scanner", department: "Service Department", category: "Service Equipment", subcategory: "Diagnostic Equipment", baselineSupply: 75, currentPrice: 45000 }
    ];

    // Agriculture sector items with departments
    const agricultureItems = [
      { name: "Wheat Seeds HD-2967", department: "Crop Production", category: "Seeds", subcategory: "Cereal Seeds", baselineSupply: 5000, currentPrice: 25 },
      { name: "Urea Fertilizer", department: "Soil Management", category: "Fertilizers", subcategory: "Nitrogen", baselineSupply: 8000, currentPrice: 22 },
      { name: "Tractor Mahindra 575 DI", department: "Farm Management", category: "Farm Equipment", subcategory: "Tractors", baselineSupply: 50, currentPrice: 850000 },
      { name: "Drip Irrigation Kit", department: "Irrigation Department", category: "Irrigation Equipment", subcategory: "Drip Systems", baselineSupply: 300, currentPrice: 15000 },
      { name: "Cypermethrin Insecticide", department: "Pest Control", category: "Pesticides", subcategory: "Insecticides", baselineSupply: 1200, currentPrice: 280 },
      { name: "Organic Compost", department: "Soil Management", category: "Fertilizers", subcategory: "Organic Fertilizers", baselineSupply: 3000, currentPrice: 35 }
    ];

    // Retail sector items with departments
    const retailItems = [
      { name: "iPhone 15 Pro", department: "Electronics & Tech", category: "Electronics", subcategory: "Smartphones", baselineSupply: 500, currentPrice: 129900 },
      { name: "Nike Air Force 1", department: "Fashion & Apparel", category: "Clothing", subcategory: "Footwear", baselineSupply: 800, currentPrice: 7500 },
      { name: "Samsung 65'' Smart TV", department: "Electronics & Tech", category: "Home Appliances", subcategory: "Television", baselineSupply: 200, currentPrice: 85000 },
      { name: "Organic Quinoa 1kg", department: "Food & Beverages", category: "Food Products", subcategory: "Health Foods", baselineSupply: 1500, currentPrice: 650 },
      { name: "Yoga Mat Premium", department: "Sports & Fitness", category: "Consumer Goods", subcategory: "Fitness Equipment", baselineSupply: 600, currentPrice: 2500 },
      { name: "Lakme Foundation", department: "Beauty & Personal Care", category: "Consumer Goods", subcategory: "Cosmetics", baselineSupply: 1200, currentPrice: 850 }
    ];

    // Energy sector items with departments
    const energyItems = [
      { name: "Solar Panel 320W", department: "Renewable Energy", category: "Solar Equipment", subcategory: "Photovoltaic Panels", baselineSupply: 2000, currentPrice: 12500 },
      { name: "Wind Turbine 2MW", department: "Renewable Energy", category: "Wind Equipment", subcategory: "Wind Generators", baselineSupply: 15, currentPrice: 12500000 },
      { name: "Lithium Battery 100kWh", department: "Energy Storage", category: "Energy Storage", subcategory: "Battery Systems", baselineSupply: 50, currentPrice: 850000 },
      { name: "Smart Grid Meter", department: "Grid Management", category: "Grid Infrastructure", subcategory: "Monitoring", baselineSupply: 5000, currentPrice: 8500 },
      { name: "Diesel Generator 250kVA", department: "Traditional Power", category: "Grid Infrastructure", subcategory: "Backup Power", baselineSupply: 100, currentPrice: 450000 },
      { name: "LED Street Light 150W", department: "Energy Efficiency", category: "Grid Infrastructure", subcategory: "Street Lighting", baselineSupply: 3000, currentPrice: 2200 }
    ];

    // Seed healthcare items
    for (const item of healthcareItems) {
      await storage.createDemandItem({
        sector: "healthcare",
        name: item.name,
        department: item.department,
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
        department: item.department,
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
        department: item.department,
        category: item.category,
        subcategory: item.subcategory,
        baselineSupply: item.baselineSupply,
        currentPrice: item.currentPrice
      });
    }

    // Seed retail items
    for (const item of retailItems) {
      await storage.createDemandItem({
        sector: "retail",
        name: item.name,
        department: item.department,
        category: item.category,
        subcategory: item.subcategory,
        baselineSupply: item.baselineSupply,
        currentPrice: item.currentPrice
      });
    }

    // Seed energy items
    for (const item of energyItems) {
      await storage.createDemandItem({
        sector: "energy",
        name: item.name,
        department: item.department,
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