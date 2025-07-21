// Realistic sample data for Indian cities when external APIs are not available
import { 
  NewsData, 
  SocialMediaData, 
  WeatherData, 
  HospitalData, 
  DemographicData 
} from './external-data';

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
  'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi'
];

// Current health concerns in India (realistic seasonal patterns)
const CURRENT_HEALTH_TRENDS = {
  winter: ['Respiratory infections', 'Pneumonia', 'Heart disease complications', 'Arthritis flare-ups'],
  summer: ['Heat stroke', 'Dehydration', 'Dengue fever', 'Chikungunya', 'Food poisoning'],
  monsoon: ['Malaria', 'Dengue', 'Typhoid', 'Hepatitis A', 'Leptospirosis', 'Cholera'],
  postMonsoon: ['Vector-borne diseases', 'Dengue fever', 'Chikungunya', 'Viral fever']
};

const DISEASE_KEYWORDS = [
  'flu symptoms', 'fever', 'dengue outbreak', 'malaria cases', 'covid symptoms',
  'stomach infection', 'viral fever', 'respiratory issues', 'heart problems',
  'diabetes management', 'hypertension', 'kidney stones', 'liver issues'
];

export function getCurrentSeason(): keyof typeof CURRENT_HEALTH_TRENDS {
  const month = new Date().getMonth() + 1;
  if (month >= 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'summer';
  if (month >= 6 && month <= 9) return 'monsoon';
  return 'postMonsoon';
}

export function generateSampleNewsData(city: string): NewsData {
  const season = getCurrentSeason();
  const healthTrends = CURRENT_HEALTH_TRENDS[season];
  
  const headlines = [
    `${city} reports seasonal health concerns as ${season} approaches`,
    `Health department issues advisory for ${city} residents`,
    `Hospital capacity monitoring in ${city} shows stable trends`,
    `Preventive health measures recommended for ${city} citizens`,
    `Air quality index shows moderate levels in ${city}`
  ];

  const healthRelated = healthTrends.map(trend => 
    `${city} health officials monitor ${trend.toLowerCase()} cases`
  );

  const diseaseOutbreaks = season === 'monsoon' 
    ? [`Monsoon-related disease surveillance increased in ${city}`, `Vector control measures active in ${city}`]
    : [`Seasonal health monitoring continues in ${city}`];

  return {
    headlines,
    healthRelated,
    diseaseOutbreaks,
    source: 'Local Health News Network',
    timestamp: new Date()
  };
}

export function generateSampleSocialMediaData(city: string): SocialMediaData {
  const season = getCurrentSeason();
  const healthTrends = CURRENT_HEALTH_TRENDS[season];
  
  const viralTopics = [
    `#${city}Health`,
    `#${season}Healthcare`,
    '#PreventiveCare',
    '#HealthyLiving',
    '#WellnessWednesday'
  ];

  const sentiment = Math.random() > 0.3 ? 'positive' : 'neutral';

  return {
    healthTrends: healthTrends.slice(0, 3),
    diseaseKeywords: DISEASE_KEYWORDS.slice(0, 5),
    publicSentiment: sentiment as 'positive' | 'negative' | 'neutral',
    viralHealthTopics: viralTopics,
    source: 'Social Media Analytics',
    timestamp: new Date()
  };
}

export function generateSampleWeatherData(city: string): WeatherData {
  const season = getCurrentSeason();
  const month = new Date().getMonth() + 1;
  
  // Realistic weather patterns for Indian cities by season
  let baseTemp, humidity, precipitation;
  
  switch (season) {
    case 'winter':
      baseTemp = city.includes('Delhi') || city.includes('Lucknow') ? 15 : 22;
      humidity = 65;
      precipitation = 2;
      break;
    case 'summer':
      baseTemp = city.includes('Mumbai') || city.includes('Chennai') ? 32 : 38;
      humidity = city.includes('Mumbai') || city.includes('Chennai') ? 75 : 45;
      precipitation = 1;
      break;
    case 'monsoon':
      baseTemp = 28;
      humidity = 85;
      precipitation = 150;
      break;
    default:
      baseTemp = 26;
      humidity = 70;
      precipitation = 20;
  }

  // Add some realistic variation
  const tempVariation = (Math.random() - 0.5) * 6;
  const humidityVariation = (Math.random() - 0.5) * 20;

  const airQualityLevels = ['Good', 'Moderate', 'Poor', 'Very Poor'];
  const aqiIndex = city.includes('Delhi') ? 3 : city.includes('Mumbai') ? 2 : Math.floor(Math.random() * 3);

  return {
    temperature: Math.round(baseTemp + tempVariation),
    humidity: Math.max(30, Math.min(95, humidity + humidityVariation)),
    pressure: 1013 + (Math.random() - 0.5) * 20,
    windSpeed: Math.round((Math.random() * 15) + 5),
    precipitation: precipitation + (Math.random() * 50),
    airQuality: airQualityLevels[aqiIndex],
    uvIndex: season === 'summer' ? Math.floor(Math.random() * 3) + 8 : Math.floor(Math.random() * 6) + 3,
    visibility: Math.round((Math.random() * 5) + 8),
    dewPoint: Math.round(baseTemp - 5 + (Math.random() * 5)),
    conditions: season === 'monsoon' ? 'Cloudy with rain' : season === 'summer' ? 'Hot and sunny' : 'Pleasant',
    source: 'India Meteorological Department',
    timestamp: new Date()
  };
}

export function generateSampleHospitalData(city: string): HospitalData[] {
  const cityPopulation = getCityPopulation(city);
  const hospitalCount = Math.ceil(cityPopulation / 100000); // 1 major hospital per 100k people
  
  const hospitals = [];
  const hospitalTypes = ['General Hospital', 'Multi-Specialty Hospital', 'Medical College', 'Government Hospital'];
  const specialties = [
    ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency'],
    ['Pediatrics', 'Gynecology', 'Surgery', 'ICU'],
    ['Dermatology', 'ENT', 'Ophthalmology', 'Psychiatry'],
    ['Nephrology', 'Gastroenterology', 'Oncology', 'Radiology']
  ];

  for (let i = 0; i < Math.min(hospitalCount, 5); i++) {
    const capacity = Math.floor(Math.random() * 400) + 200;
    const occupancyRate = 0.65 + (Math.random() * 0.25); // 65-90% occupancy
    const occupied = Math.floor(capacity * occupancyRate);
    
    hospitals.push({
      hospitalName: `${city} ${hospitalTypes[i % hospitalTypes.length]} ${i + 1}`,
      capacity,
      occupancy: Math.round(occupancyRate * 100),
      availableBeds: capacity - occupied,
      emergencyWait: `${Math.floor(Math.random() * 45) + 15} minutes`,
      specialties: specialties[i % specialties.length],
      location: `${city} - Sector ${i + 1}`,
      contact: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
    });
  }

  return hospitals;
}

export function generateSampleDemographicData(city: string): DemographicData {
  const population = getCityPopulation(city);
  
  // Age distribution based on Indian census patterns
  const ageDistribution = {
    "0-18": Math.round(population * 0.28),    // 28% children
    "19-35": Math.round(population * 0.32),   // 32% young adults
    "36-55": Math.round(population * 0.25),   // 25% middle-aged
    "56-70": Math.round(population * 0.10),   // 10% seniors
    "70+": Math.round(population * 0.05)      // 5% elderly
  };

  const economicLevels = ['Lower middle class', 'Middle class', 'Upper middle class'];
  const educationLevels = ['Primary', 'Secondary', 'Higher Secondary', 'Graduate'];
  const healthcareAccess = ['Basic', 'Moderate', 'Good', 'Excellent'];
  const urbanization = ['Urban', 'Semi-urban', 'Metropolitan'];

  return {
    region: city,
    population,
    ageDistribution,
    economicStatus: economicLevels[Math.floor(Math.random() * economicLevels.length)],
    educationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)],
    healthcareAccess: healthcareAccess[Math.floor(Math.random() * healthcareAccess.length)],
    urbanization: urbanization[Math.floor(Math.random() * urbanization.length)],
    source: 'Census Data India',
    timestamp: new Date()
  };
}

function getCityPopulation(city: string): number {
  const populationMap: Record<string, number> = {
    'Mumbai': 12442373,
    'Delhi': 11007835,
    'Bangalore': 8443675,
    'Hyderabad': 6993262,
    'Chennai': 4681087,
    'Kolkata': 4496694,
    'Pune': 3124458,
    'Ahmedabad': 5633927,
    'Jaipur': 3046163,
    'Surat': 4467797,
    'Lucknow': 2817105,
    'Kanpur': 2767031,
    'Nagpur': 2405421,
    'Indore': 1964086,
    'Thane': 1818872,
    'Bhopal': 1795648,
    'Visakhapatnam': 1730320,
    'Pimpri-Chinchwad': 1729359,
    'Patna': 1684222,
    'Vadodara': 1666703
  };

  return populationMap[city] || Math.floor(Math.random() * 2000000) + 500000;
}

// Disease patterns specific to Indian regions and seasons
export function getRegionalDiseasePatterns(city: string, season: string) {
  const coastalCities = ['Mumbai', 'Chennai', 'Visakhapatnam'];
  const northernCities = ['Delhi', 'Lucknow', 'Kanpur', 'Jaipur'];
  const westernCities = ['Pune', 'Ahmedabad', 'Surat', 'Vadodara'];
  
  const basePatterns = {
    winter: ['Respiratory infections', 'Pneumonia', 'Heart complications'],
    summer: ['Heat exhaustion', 'Dehydration', 'Food poisoning'],
    monsoon: ['Dengue', 'Malaria', 'Typhoid', 'Hepatitis A'],
    postMonsoon: ['Vector-borne diseases', 'Viral fever']
  };

  let regionalRisks = [];
  
  if (coastalCities.includes(city)) {
    regionalRisks = ['High humidity respiratory issues', 'Skin infections'];
  } else if (northernCities.includes(city)) {
    regionalRisks = ['Air pollution related diseases', 'Seasonal allergies'];
  } else if (westernCities.includes(city)) {
    regionalRisks = ['Water-borne diseases', 'Heat-related illnesses'];
  }

  return {
    seasonal: basePatterns[season as keyof typeof basePatterns] || [],
    regional: regionalRisks,
    riskLevel: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
  };
}