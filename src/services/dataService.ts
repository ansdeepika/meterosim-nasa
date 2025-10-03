// Data service for fetching real-time data for each feature card
import axios from 'axios';

// NASA API configuration
const NASA_API_KEY = 'DEMO_KEY'; // Replace with your NASA API key from https://api.nasa.gov
const NASA_BASE_URL = 'https://api.nasa.gov';

// Types for API responses
export interface NearEarthObject {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      kilometers: string;
    };
  }>;
  is_potentially_hazardous_asteroid: boolean;
}

export interface ImpactCalculation {
  energy_joules: number;
  energy_megatons: number;
  crater_diameter_km: number;
  damage_radius_km: number;
  casualties_estimate: number;
}

export interface CityData {
  name: string;
  population: number;
  density_per_km2: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// NASA NeoWs API - Real asteroid data
export const fetchNearEarthObjects = async (startDate?: string, endDate?: string) => {
  try {
    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, {
      params: {
        start_date: start,
        end_date: end,
        api_key: NASA_API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    return null;
  }
};

// Physics calculations for impact analysis
export const calculateImpactPhysics = (
  diameter_km: number, 
  velocity_km_s: number, 
  density_kg_m3: number = 2600, // Average asteroid density
  target_population: number = 1000000
): ImpactCalculation => {
  
  // Convert to meters
  const diameter_m = diameter_km * 1000;
  const velocity_m_s = velocity_km_s * 1000;
  
  // Calculate mass (assuming spherical asteroid)
  const radius_m = diameter_m / 2;
  const volume_m3 = (4/3) * Math.PI * Math.pow(radius_m, 3);
  const mass_kg = volume_m3 * density_kg_m3;
  
  // Kinetic energy: E = 1/2 * m * v²
  const energy_joules = 0.5 * mass_kg * Math.pow(velocity_m_s, 2);
  
  // Convert to megatons TNT (1 megaton = 4.184 × 10^15 joules)
  const energy_megatons = energy_joules / (4.184e15);
  
  // Crater diameter (empirical formula): D = 1.8 * (E^0.25) where E is in megatons
  const crater_diameter_km = 1.8 * Math.pow(energy_megatons, 0.25);
  
  // Damage radius (rough estimate based on energy)
  const damage_radius_km = Math.sqrt(energy_megatons) * 2;
  
  // Casualty estimate (very rough - based on population density and damage area)
  const damage_area_km2 = Math.PI * Math.pow(damage_radius_km, 2);
  const casualties_estimate = Math.min(
    target_population * 0.1, // Max 10% of population
    damage_area_km2 * 1000 // Rough density estimate
  );
  
  return {
    energy_joules,
    energy_megatons,
    crater_diameter_km,
    damage_radius_km,
    casualties_estimate: Math.round(casualties_estimate)
  };
};

// Major world cities data
export const MAJOR_CITIES: CityData[] = [
  { name: 'New York', population: 8336817, density_per_km2: 10947, coordinates: { lat: 40.7128, lng: -74.0060 } },
  { name: 'London', population: 9648110, density_per_km2: 5666, coordinates: { lat: 51.5074, lng: -0.1278 } },
  { name: 'Tokyo', population: 37400068, density_per_km2: 6158, coordinates: { lat: 35.6762, lng: 139.6503 } },
  { name: 'Paris', population: 2161000, density_per_km2: 20169, coordinates: { lat: 48.8566, lng: 2.3522 } },
  { name: 'Los Angeles', population: 3898747, density_per_km2: 3124, coordinates: { lat: 34.0522, lng: -118.2437 } },
  { name: 'Mumbai', population: 20411274, density_per_km2: 31700, coordinates: { lat: 19.0760, lng: 72.8777 } },
  { name: 'Beijing', population: 21542000, density_per_km2: 1311, coordinates: { lat: 39.9042, lng: 116.4074 } },
  { name: 'São Paulo', population: 12325232, density_per_km2: 7398, coordinates: { lat: -23.5558, lng: -46.6396 } },
  { name: 'Cairo', population: 10230350, density_per_km2: 19376, coordinates: { lat: 30.0444, lng: 31.2357 } },
  { name: 'Mexico City', population: 9209944, density_per_km2: 6163, coordinates: { lat: 19.4326, lng: -99.1332 } }
];

// AI Risk Assessment (simulated intelligent analysis)
export const generateAIRiskAssessment = (
  asteroid: Partial<NearEarthObject>, 
  targetCity: CityData,
  impactData: ImpactCalculation
) => {
  const riskFactors = {
    size_risk: asteroid.estimated_diameter ? 
      (asteroid.estimated_diameter.kilometers.estimated_diameter_max > 1 ? 'EXTREME' : 
       asteroid.estimated_diameter.kilometers.estimated_diameter_max > 0.1 ? 'HIGH' : 'MODERATE') : 'UNKNOWN',
    
    population_risk: targetCity.population > 10000000 ? 'EXTREME' : 
                    targetCity.population > 1000000 ? 'HIGH' : 'MODERATE',
    
    density_risk: targetCity.density_per_km2 > 15000 ? 'EXTREME' :
                  targetCity.density_per_km2 > 5000 ? 'HIGH' : 'MODERATE',
    
    energy_risk: impactData.energy_megatons > 1000 ? 'EXTREME' :
                 impactData.energy_megatons > 100 ? 'HIGH' : 'MODERATE'
  };
  
  const recommendations = [
    `Immediate evacuation radius: ${Math.round(impactData.damage_radius_km * 1.5)} km`,
    `Estimated evacuation time needed: ${Math.round(targetCity.population / 50000)} hours`,
    `Emergency shelters required: ${Math.round(impactData.casualties_estimate / 100)}`,
    `Medical facilities to alert: ${Math.round(targetCity.population / 100000)}`,
    `Infrastructure priority: ${targetCity.density_per_km2 > 10000 ? 'Mass transit systems' : 'Highway networks'}`
  ];
  
  return {
    overall_risk: Object.values(riskFactors).includes('EXTREME') ? 'EXTREME' :
                  Object.values(riskFactors).includes('HIGH') ? 'HIGH' : 'MODERATE',
    risk_factors: riskFactors,
    recommendations,
    confidence_score: 0.85 // Simulated AI confidence
  };
};

// Historical impact data
export const HISTORICAL_IMPACTS = [
  {
    name: 'Chicxulub Impact',
    date: '66 million years ago',
    location: 'Yucatan Peninsula, Mexico',
    diameter_km: 10,
    energy_megatons: 100000000,
    effects: 'Mass extinction event, ended the age of dinosaurs'
  },
  {
    name: 'Tunguska Event',
    date: '1908',
    location: 'Siberia, Russia',
    diameter_km: 0.06,
    energy_megatons: 15,
    effects: 'Flattened 2,000 km² of forest'
  },
  {
    name: 'Chelyabinsk Meteor',
    date: '2013',
    location: 'Russia',
    diameter_km: 0.02,
    energy_megatons: 0.5,
    effects: '1,500 people injured by glass fragments'
  }
];

// Planetary defense systems data
export const DEFENSE_SYSTEMS = [
  {
    name: 'DART Mission',
    type: 'Kinetic Impactor',
    status: 'Successfully tested 2022',
    effectiveness: 'Proved asteroid deflection possible',
    details: 'Changed Dimorphos orbit by 32 minutes'
  },
  {
    name: 'Catalina Sky Survey',
    type: 'Detection System',
    status: 'Active',
    effectiveness: 'Discovers ~1,000 NEOs per year',
    details: 'Ground-based telescope in Arizona'
  },
  {
    name: 'NEOWISE',
    type: 'Space-based Detection',
    status: 'Active',
    effectiveness: 'Infrared detection of dark asteroids',
    details: 'Has discovered over 3,000 NEOs'
  }
];

// Time-lapse simulation phases
export const IMPACT_PHASES = [
  {
    time: '0 seconds',
    phase: 'Initial Contact',
    description: 'Asteroid enters atmosphere at hypersonic speed',
    effects: 'Bright fireball visible, sonic booms'
  },
  {
    time: '0.1 seconds',
    phase: 'Atmospheric Entry',
    description: 'Intense heating and fragmentation begins',
    effects: 'Plasma formation, electromagnetic pulse'
  },
  {
    time: '1 second',
    phase: 'Ground Impact',
    description: 'Kinetic energy converts to heat and shock waves',
    effects: 'Crater formation, seismic waves, thermal radiation'
  },
  {
    time: '10 seconds',
    phase: 'Immediate Aftermath',
    description: 'Shock wave propagation and debris ejection',
    effects: 'Building collapse, fires, debris rain'
  },
  {
    time: '1 hour',
    phase: 'Local Effects',
    description: 'Dust cloud formation and local climate effects',
    effects: 'Reduced visibility, temperature changes'
  },
  {
    time: '1 day',
    phase: 'Regional Impact',
    description: 'Atmospheric disturbances spread regionally',
    effects: 'Weather pattern disruption, acid rain'
  },
  {
    time: '1 month',
    phase: 'Global Effects',
    description: 'Dust and particles affect global climate',
    effects: 'Temperature drop, agricultural impact'
  }
];

// Export all data fetching functions
export const DataService = {
  fetchNearEarthObjects,
  calculateImpactPhysics,
  generateAIRiskAssessment,
  MAJOR_CITIES,
  HISTORICAL_IMPACTS,
  DEFENSE_SYSTEMS,
  IMPACT_PHASES
};