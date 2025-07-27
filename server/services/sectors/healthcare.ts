import { pwcGeminiClient } from "../pwc-gemini-client";
import { fetchComprehensiveRegionData } from "../external-data";
import { fetchRealHealthData, fetchRealDiseaseData } from "../real-data";

export interface HealthcareForecastInput {
  region: string;
  timeframe: string;
}

export interface HealthcarePrediction {
  itemName: string;
  composition: string; // Active pharmaceutical ingredients
  department: string;
  category: string;
  subcategory: string;
  currentDemand: number;
  predictedDemand: number;
  demandUnit: string; // units/month, patients/week, etc.
  demandChange: number; // Required for main interface compatibility
  demandChangePercentage: number;
  demandTrend: string; // "increase", "decrease", "no change"
  confidence: number;
  peakPeriod: string;
  reasoning: string;
  detailedSources: string[]; // Specific data sources used
  marketFactors: string[];
  marketFactorData?: {
    environmentalImpact: number;
    diseasePrevalence: number;
    healthcareAccess: number;
    economicAffordability: number;
    policySupport: number;
    supplyChainStability: number;
    clinicalEvidence: number;
  };
  recommendations: string[];
  newsImpact: string;
  seasonalFactor: string;
  riskLevel: string;
}

async function fetchRealTimeData(region: string) {
  try {
    console.log(`Fetching real-time data for healthcare in ${region}...`);
    
    const [comprehensiveData, healthData, diseaseData] = await Promise.all([
      fetchComprehensiveRegionData(region),
      fetchRealHealthData(region),
      fetchRealDiseaseData(region)
    ]);

    return {
      comprehensive: comprehensiveData,
      health: healthData,
      diseases: diseaseData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Warning: Could not fetch all real-time data for ${region}:`, error);
    // Return basic fallback structure
    return {
      comprehensive: { weather: { conditions: "Variable", temperature: 75, humidity: 60, airQuality: "Moderate" }, news: { healthRelated: [], diseaseOutbreaks: [] }, socialMedia: { diseaseKeywords: [], publicSentiment: "neutral" } },
      health: { healthcareCapacity: "Adequate", recentDiseaseReports: [], vaccinationRates: {}, hospitalOccupancy: 70, medicalSupplies: {}, publicHealthMeasures: [] },
      diseases: [],
      timestamp: new Date().toISOString()
    };
  }
}

function getLocationSpecificContext(cityName: string, countryName: string): string {
  const locationProfiles: Record<string, Record<string, string>> = {
    'India': {
      'Delhi': `
- **Climate**: Hot, humid summers with severe air pollution (AQI often >300)
- **Common Health Issues**: Respiratory diseases, vector-borne illnesses (dengue, malaria), diabetes, cardiovascular disease
- **Healthcare Infrastructure**: Major medical hub with AIIMS, advanced tertiary care
- **Seasonal Patterns**: Monsoon-related waterborne diseases, winter respiratory issues
- **Demographics**: Urban population, high pollution exposure, lifestyle diseases
- **Specific Challenges**: Air quality-related asthma, heat stroke in summer, infectious disease outbreaks`,
      
      'Mumbai': `
- **Climate**: Tropical, heavy monsoons, high humidity year-round
- **Common Health Issues**: Waterborne diseases, respiratory issues, tropical infections, mental health
- **Healthcare Infrastructure**: Commercial capital with major private hospitals
- **Seasonal Patterns**: Monsoon flooding increases infection risk, year-round tropical diseases
- **Demographics**: Dense urban population, economic stress factors
- **Specific Challenges**: Leptospirosis during monsoons, air pollution, overcrowding-related diseases`,
      
      'Bangalore': `
- **Climate**: Pleasant weather, moderate pollution
- **Common Health Issues**: Lifestyle diseases, diabetes, hypertension, mental health
- **Healthcare Infrastructure**: IT hub with good private healthcare facilities
- **Seasonal Patterns**: Moderate seasonal variation, less extreme health impacts
- **Demographics**: Young professional population, sedentary lifestyle
- **Specific Challenges**: Tech industry stress, lifestyle-related metabolic disorders`,
      
      'Chennai': `
- **Climate**: Hot, humid coastal climate, cyclone-prone
- **Common Health Issues**: Heat-related illnesses, vector-borne diseases, diabetes
- **Healthcare Infrastructure**: Major medical tourism destination
- **Seasonal Patterns**: Cyclone season health emergencies, summer heat waves
- **Demographics**: Aging population, diabetes belt region
- **Specific Challenges**: Heat stroke, diabetes complications, flood-related infections`,
      
      'Kolkata': `
- **Climate**: Humid subtropical, heavy monsoons
- **Common Health Issues**: Vector-borne diseases, respiratory issues, digestive disorders
- **Healthcare Infrastructure**: Historic medical institutions, mixed public-private
- **Seasonal Patterns**: Monsoon increases disease transmission, winter respiratory issues
- **Demographics**: Dense urban areas, socioeconomic disparities
- **Specific Challenges**: Malaria, dengue, waterborne diseases, air pollution impacts`
    },
    
    'UK': {
      'London': `
- **Climate**: Temperate maritime, mild winters, cool summers
- **Common Health Issues**: Respiratory diseases, mental health, cardiovascular disease, diabetes
- **Healthcare Infrastructure**: NHS-based universal healthcare, world-class hospitals
- **Seasonal Patterns**: Winter flu seasons, spring allergies, seasonal affective disorder
- **Demographics**: Diverse urban population, aging demographics
- **Specific Challenges**: Mental health crisis, long NHS waiting times, winter pressures`,
      
      'Manchester': `
- **Climate**: Wet, mild climate with frequent rainfall
- **Common Health Issues**: Respiratory conditions, mental health, substance abuse, cardiovascular disease
- **Healthcare Infrastructure**: Strong NHS foundation trusts, research hospitals
- **Seasonal Patterns**: Winter respiratory illness peaks, damp-related health issues
- **Demographics**: Post-industrial population, health inequalities
- **Specific Challenges**: Industrial legacy health impacts, socioeconomic health gaps`,
      
      'Salford': `
- **Climate**: Maritime temperate, high rainfall, mild temperatures
- **Common Health Issues**: Respiratory diseases, cardiovascular conditions, mental health, obesity
- **Healthcare Infrastructure**: Part of Greater Manchester NHS, good hospital access
- **Seasonal Patterns**: Winter flu outbreaks, seasonal depression, damp-related conditions
- **Demographics**: Working-class population, health deprivation challenges
- **Specific Challenges**: Industrial pollution legacy, socioeconomic health disparities, higher chronic disease rates`
    },
    
    'USA': {
      'New York': `
- **Climate**: Humid continental, hot summers, cold winters
- **Common Health Issues**: Stress-related conditions, cardiovascular disease, diabetes, mental health
- **Healthcare Infrastructure**: World-renowned medical centers, insurance-based system
- **Seasonal Patterns**: Winter flu seasons, summer heat-related illnesses
- **Demographics**: Dense urban population, high stress lifestyle
- **Specific Challenges**: Healthcare costs, stress-related disorders, urban air quality`,
      
      'Los Angeles': `
- **Climate**: Mediterranean, dry summers, mild winters, smog issues
- **Common Health Issues**: Respiratory diseases from smog, skin conditions, lifestyle diseases
- **Healthcare Infrastructure**: Major medical centers, insurance disparities
- **Seasonal Patterns**: Fire season respiratory issues, year-round allergies
- **Demographics**: Diverse population, significant uninsured populations
- **Specific Challenges**: Air quality-related asthma, healthcare access inequities`
    },
    
    'Bangladesh': {
      'Dhaka': `
- **Climate**: Tropical monsoon, hot humid summers, heavy rains
- **Common Health Issues**: Waterborne diseases, respiratory infections, malnutrition, infectious diseases
- **Healthcare Infrastructure**: Limited public healthcare, growing private sector
- **Seasonal Patterns**: Monsoon flooding increases disease transmission
- **Demographics**: Dense urban population, significant poverty
- **Specific Challenges**: Water contamination, air pollution, limited healthcare access, infectious disease outbreaks`
    }
  };

  const countryProfile = locationProfiles[countryName];
  if (countryProfile && countryProfile[cityName]) {
    return countryProfile[cityName];
  }
  
  // Fallback for unknown locations
  return `
- **Climate**: Variable climate conditions
- **Common Health Issues**: General population health needs
- **Healthcare Infrastructure**: Standard healthcare facilities
- **Seasonal Patterns**: Typical seasonal health variations
- **Demographics**: Mixed population demographics  
- **Specific Challenges**: Standard healthcare challenges for the region`;
}

export async function generateHealthcarePredictions(
  region: string, 
  timeframe: string, 
  department?: string, 
  category?: string
): Promise<HealthcarePrediction[]> {
  try {
    console.log(`🤖 Generating AI-driven healthcare demand forecast for ${region}...`);
    
    // Get real-time data with news integration
    const realTimeData = await fetchRealTimeData(region);
    
    // Convert timeframe to standardized periods
    const standardizedTimeframe = timeframe.includes('15') ? '15 days' : 
                                 timeframe.includes('30') ? '30 days' : 
                                 timeframe.includes('60') ? '60 days' : '30 days';

    const departmentFilter = department && department !== "all" ? `
MANDATORY DEPARTMENT RESTRICTION: ${department}
- Generate predictions ONLY for items specifically used by ${department}
- Each prediction must be directly relevant to ${department} operations
- Consider only ${department}-specific workflows, equipment, and medications
- NO items from other departments should appear in predictions` : "";

    const categoryFilter = category && category !== "all" ? `
MANDATORY CATEGORY RESTRICTION: ${category}
- Generate predictions ONLY for items in the "${category}" category
- Each prediction must belong exclusively to the "${category}" category
- NO items from other categories should appear in predictions
- Focus only on ${category}-specific products and services` : "";

    // Extract location-specific details
    const locationParts = region.split(', ');
    const cityName = locationParts[0] || region;
    const countryName = locationParts[1] || 'India';
    
    // Define location-specific characteristics
    const locationContext = getLocationSpecificContext(cityName, countryName);
    
    const prompt = `
You are an expert healthcare demand forecasting analyst with access to real-time market data, pharmaceutical intelligence, and medical sector expertise.

Generate professional demand predictions for healthcare/pharmaceutical sector in ${cityName}, ${countryName} for the next ${standardizedTimeframe}.
${departmentFilter}
${categoryFilter}

LOCATION-SPECIFIC CONTEXT FOR ${cityName.toUpperCase()}, ${countryName.toUpperCase()}:
${locationContext}

Real-time Market Context:
${JSON.stringify(realTimeData, null, 2)}

HEALTHCARE SUBCATEGORIES FOR FORECASTING:

1. RESPIRATORY MEDICATIONS:
   - Bronchodilators: Salbutamol, Budesonide, Formoterol, Tiotropium
   - Inhaled Corticosteroids: Beclomethasone, Fluticasone, Mometasone
   - Cough Suppressants: Dextromethorphan, Codeine-based syrups
   - Mucolytics: Acetylcysteine, Ambroxol, Guaifenesin
   - Anti-histamines: Cetirizine, Loratadine, Montelukast, Fexofenadine

2. CARDIOVASCULAR PHARMACEUTICALS:
   - ACE Inhibitors: Enalapril, Lisinopril, Ramipril, Captopril
   - Beta Blockers: Metoprolol, Atenolol, Propranolol, Carvedilol
   - Statins: Atorvastatin, Rosuvastatin, Simvastatin, Pravastatin
   - Anticoagulants: Warfarin, Clopidogrel, Rivaroxaban, Dabigatran
   - Calcium Channel Blockers: Amlodipine, Nifedipine, Diltiazem

3. NEUROLOGICAL MEDICATIONS:
   - Antidepressants: Sertraline, Fluoxetine, Escitalopram, Venlafaxine
   - Anticonvulsants: Phenytoin, Carbamazepine, Levetiracetam, Lamotrigine
   - Pain Management: Tramadol, Gabapentin, Pregabalin, Morphine
   - Anti-anxiety: Alprazolam, Clonazepam, Lorazepam, Diazepam
   - Migraine Medications: Sumatriptan, Rizatriptan, Topiramate

4. ENDOCRINE & METABOLIC:
   - Diabetes Medications: Metformin, Glimepiride, Sitagliptin, Insulin variants
   - Thyroid Medications: Levothyroxine, Carbimazole, Methimazole
   - Hormone Replacement: Estradiol patches, Testosterone gels
   - Bone Health: Alendronate, Calcitriol, Calcium supplements

5. GASTROENTEROLOGY:
   - Proton Pump Inhibitors: Omeprazole, Pantoprazole, Esomeprazole
   - Antacids: Aluminum hydroxide, Magnesium hydroxide combinations
   - Digestive Enzymes: Pancreatin, Alpha-galactosidase
   - Anti-diarrheals: Loperamide, Racecadotril

6. MEDICAL EQUIPMENT & DEVICES:
   - Diagnostic Devices: Digital glucometers, BP monitors, Pulse oximeters, Thermometers
   - Surgical Instruments: Disposable scalpels, Laparoscopic tools, Suture materials
   - Emergency Equipment: Portable oxygen concentrators, Nebulizers, Defibrillators
   - Rehabilitation Aids: Prosthetics, Orthotics, Mobility aids, Physiotherapy equipment

7. MEDICAL SUPPLIES & CONSUMABLES:
   - PPE: N95 masks, Nitrile gloves, Face shields, Surgical gowns
   - Wound Care: Hydrocolloid dressings, Antiseptic solutions, Gauze bandages
   - Disposables: Sterile syringes, IV catheters, Blood collection tubes
   - Laboratory Supplies: Rapid test kits, Culture media, Reagents

FORECASTING REQUIREMENTS:

1. NEWS & MARKET INTEGRATION:
   - Analyze recent pharmaceutical news affecting ${region}
   - Consider government healthcare policies and budget changes
   - Factor in disease outbreak reports and public health alerts
   - Include impact of new drug approvals or recalls
   - Account for healthcare infrastructure developments

2. DEMAND VARIATION PATTERNS:
   - Increases: 5-30% for items with positive clinical evidence, policy support, or outbreak-related needs
   - Decreases: 5-25% due to policy restrictions, better alternatives, or reduced disease prevalence
   - Stable: ±3% for established medications with consistent demand patterns
   - Include specific rationale for each prediction

3. PROFESSIONAL FORECASTING CRITERIA:
   - Base predictions on epidemiological data and disease surveillance
   - Consider seasonal disease patterns (monsoon illnesses, winter respiratory issues)
   - Factor in demographic health trends and aging population
   - Account for healthcare accessibility and insurance coverage changes
   - Include supply chain considerations and manufacturer capacity

4. TIMEFRAME SPECIFICATIONS:
   - 15 days: Focus on immediate needs, emergency supplies, acute conditions
   - 30 days: Standard forecasting for chronic medications and routine supplies
   - 60 days: Strategic planning for seasonal preparation and bulk procurement

5. DETAILED SOURCE REQUIREMENTS:
   Must include specific data sources for each prediction:
   - WHO Disease Surveillance Reports for epidemiological data
   - National Medical Devices Authority (NMDA) approvals and alerts
   - Central Drugs Standard Control Organization (CDSCO) bulletins
   - Indian Medical Association (IMA) clinical guidelines updates
   - Regional health department disease monitoring systems
   - Pharmaceutical pricing and availability data from NPPA
   - Hospital pharmacy procurement and usage statistics
   - Clinical research publications and medical literature
   - Government health policy announcements and budget allocations
   - International pharmaceutical market trends affecting India

6. ELABORATIVE AI REASONING REQUIREMENTS:
   Each prediction must include comprehensive, detailed reasoning that covers:
   - Specific epidemiological trends and disease surveillance data analysis
   - Detailed clinical evidence supporting demand projections
   - Comprehensive market dynamics and competitive landscape analysis
   - Thorough policy impact assessment with specific regulatory implications
   - Detailed seasonal patterns and environmental factor correlations
   - Supply chain analysis including manufacturer capacity and distribution channels
   - Demographic shift analysis and population health trend impacts
   - Economic factor analysis including pricing trends and affordability
   - Technology adoption patterns and medical practice evolution
   - Regional healthcare infrastructure capacity and accessibility factors
   
   Reasoning should be 3-4 detailed sentences minimum, providing deep analytical insights
   
7. MARKET FACTORS WITH DETAILED EXPLANATIONS:
   Each market factor must follow this format: Factor → Reason → Source → Link
   Example: "Respiratory Disease Increase → Air quality deteriorated by 15% due to industrial pollution → Central Pollution Control Board Report → www.cpcb.nic.in/air-quality-data"
   
   Required factors with explanations:
   - Environmental Impact: Specific air quality, weather, pollution data with government monitoring sources
   - Disease Prevalence: Current disease outbreaks, seasonal patterns with WHO/health ministry sources  
   - Healthcare Access: Hospital capacity, infrastructure availability with health department data
   - Economic Affordability: Medicine pricing, insurance coverage with NPPA/insurance authority sources
   - Policy Support: Government health policies, drug approvals with ministry announcement sources
   - Supply Chain: Manufacturing capacity, distribution issues with pharma industry reports
   - Clinical Evidence: Latest research, medical guidelines with medical journal/association sources

8. MARKET FACTORS GRAPHICAL DATA:
   For visualization, include quantitative scores (0-100):
   - Environmental Impact Score (0-100): Air quality, weather conditions, pollution levels
   - Disease Prevalence Trend (0-100): Current outbreak levels, seasonal disease patterns
   - Healthcare Access Score (0-100): Hospital capacity, medical infrastructure availability
   - Economic Affordability Index (0-100): Pricing accessibility, insurance coverage
   - Policy Support Level (0-100): Government initiatives, regulatory support
   - Supply Chain Stability (0-100): Manufacturing capacity, distribution efficiency
   - Clinical Evidence Strength (0-100): Research support, medical guideline recommendations

MANDATORY REQUIREMENTS FOR LOCATION-SPECIFIC DIVERSITY:

1. **LOCATION-SPECIFIC HEALTH CHALLENGES**: Each prediction must address specific health issues prevalent in ${cityName}, ${countryName}
   - Delhi: Air pollution respiratory issues, heat stroke medications, vector-borne disease treatments
   - Mumbai: Monsoon-related infections, tropical disease medications, humidity-related conditions
   - Salford, UK: Winter respiratory illnesses, depression medications, industrial health issues
   - Jacksonville, USA: Heat-related medications, hurricane preparedness supplies, diabetes management

2. **MANDATORY PRODUCT DIVERSITY**: NO REPETITION of similar products allowed
   - Each prediction must be for a COMPLETELY DIFFERENT medication/device/supply
   - Cover different therapeutic areas: respiratory, cardiovascular, neurological, endocrine, infectious disease, mental health, surgical, emergency, diagnostic, rehabilitation
   - Include different dosage forms: tablets, injections, inhalers, patches, devices, surgical tools

3. **DEPARTMENT-SPECIFIC PRODUCT SELECTION**:
   ${department ? `Since department is ${department}, focus ONLY on products used by ${department}:
   - Emergency Department: Emergency medications, resuscitation equipment, trauma supplies
   - Cardiology Department: Heart medications, cardiac devices, monitoring equipment
   - Respiratory Department: Pulmonary medications, oxygen equipment, lung function devices
   - Endocrinology Department: Diabetes medications, hormone treatments, glucose monitoring
   - Mental Health Department: Psychiatric medications, therapy equipment, assessment tools
   - Surgery Department: Surgical instruments, anesthetics, post-operative care supplies
   - Pediatrics Department: Child-specific medications, pediatric equipment, vaccines
   - Oncology Department: Cancer treatments, chemotherapy drugs, radiation equipment` : 'Cover ALL departments with diverse predictions for each'}

4. **CATEGORY-SPECIFIC LIMITATIONS**:
   ${category ? `Since category is ${category}, include ONLY ${category} items:
   - Pharmaceuticals: Medications, drugs, therapeutic compounds
   - Medical Equipment: Devices, machines, diagnostic tools, monitoring equipment
   - Medical Supplies: Consumables, disposables, surgical materials, protective equipment` : 'Include diverse mix of pharmaceuticals, equipment, and supplies'}

5. **LOCATION-BASED DEMAND VARIATIONS**: Demand changes must reflect local conditions
   - High pollution areas: Increased respiratory medications
   - Hot climates: More heat-related treatments, IV fluids
   - Cold climates: More winter illness medications, heating equipment
   - Flood-prone areas: More infection treatments, water purification
   - Industrial areas: More occupational health supplies

LOCATION-SPECIFIC PRODUCT EXAMPLES (use these as inspiration, not exact copies):
- ${cityName === 'Delhi' ? 'Air purifiers, N95 masks, bronchodilators for pollution, ORS for heat stroke, dengue rapid tests' : ''}
- ${cityName === 'Mumbai' ? 'Antifungal creams for humidity, water purification tablets, leptospirosis antibiotics, IV fluids for dehydration' : ''}
- ${cityName === 'Salford' ? 'Vitamin D supplements for low sunlight, antidepressants for seasonal depression, flu vaccines, heating pads' : ''}
- ${cityName === 'Jacksonville' ? 'Hurricane emergency supplies, diabetes management for heat stress, electrolyte solutions, cooling blankets' : ''}
- ${cityName === 'Dhaka' ? 'Water purification systems, cholera vaccines, flood-related infection treatments, mosquito nets' : ''}

MANDATORY DIVERSITY REQUIREMENTS:
- Use different active ingredients for each medication
- Include different types of medical devices (diagnostic, therapeutic, monitoring)  
- Cover different body systems (respiratory, cardiac, neurological, digestive, endocrine)
- Include both acute and chronic condition treatments
- Mix emergency, routine, and preventive healthcare items

Generate exactly 10 COMPLETELY DIFFERENT predictions with NO product repetition. Each prediction must be for a unique healthcare item specific to ${cityName}, ${countryName}'s health challenges.

Respond with JSON array in this exact format:
[{
  "itemName": "string (specific medication/device name with strength/specification)",
  "composition": "string (active pharmaceutical ingredients or device specifications)", 
  "department": "string (e.g., 'Cardiology Department', 'Emergency Department', 'Respiratory Department')",
  "category": "string (Pharmaceuticals/Medical Equipment/Medical Supplies)",
  "subcategory": "string (specific therapeutic area)", 
  "currentDemand": number (baseline units per month for region),
  "predictedDemand": number (forecasted units for timeframe),
  "demandUnit": "string (units/month, patients/week, pieces/month, etc.)",
  "demandChangePercentage": number (percentage change as number, e.g., 15.5 for 15.5% increase, -8.2 for 8.2% decrease),
  "demandTrend": "string (increase/decrease/no change)",
  "confidence": number (0.65-0.95 based on data quality),
  "peakPeriod": "${standardizedTimeframe}",
  "reasoning": "string (3-4 detailed sentences covering epidemiological trends, clinical evidence, market dynamics, policy impacts, seasonal patterns, supply chain analysis, demographic factors, economic considerations, and regional healthcare infrastructure)",
  "detailedSources": ["string (specific authoritative sources like WHO, CDSCO, IMA, hospital reports, etc.)"],
  "marketFactors": ["string (Factor → Reason → Source → Link format, e.g., 'Respiratory Disease Increase → Air quality deteriorated by 15% → CPCB Report → www.cpcb.nic.in')"],
  "marketFactorData": {
    "environmentalImpact": number (0-100),
    "diseasePrevalence": number (0-100),
    "healthcareAccess": number (0-100),
    "economicAffordability": number (0-100),
    "policySupport": number (0-100),
    "supplyChainStability": number (0-100),
    "clinicalEvidence": number (0-100)
  },
  "recommendations": ["string (actionable business and clinical recommendations)"],
  "newsImpact": "string (specific news or policy affecting this item)",
  "seasonalFactor": "string (seasonal disease or climate influence)",
  "riskLevel": "Low/Medium/High"
}]
`;

    const predictions = await pwcGeminiClient.generateJSON(prompt);
    // Add demandChange field for compatibility
    return predictions.map((p: any) => ({
      ...p,
      demandChange: p.predictedDemand - p.currentDemand
    }));
  } catch (error) {
    console.error('Error generating healthcare predictions:', error);
    throw new Error(`Failed to generate healthcare demand forecast: ${error}`);
  }
}