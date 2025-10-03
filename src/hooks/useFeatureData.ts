import { useState, useEffect } from 'react';
import { DataService, NearEarthObject, ImpactCalculation, CityData } from '../services/dataService';

export interface FeatureData {
  scientificPhysics: {
    formulas: Array<{
      name: string;
      formula: string;
      description: string;
      example: string;
    }>;
    calculations: ImpactCalculation | null;
    loading: boolean;
  };
  nasaData: {
    nearEarthObjects: NearEarthObject[];
    nextApproaches: Array<{
      name: string;
      date: string;
      distance: string;
      size: string;
      hazardous: boolean;
    }>;
    loading: boolean;
    error: string | null;
  };
  aiRisk: {
    assessment: any;
    vulnerableCities: CityData[];
    riskMatrix: Array<{
      factor: string;
      level: string;
      impact: string;
    }>;
    loading: boolean;
  };
  impactAnalysis: {
    historicalData: typeof DataService.HISTORICAL_IMPACTS;
    damageModels: Array<{
      category: string;
      description: string;
      formula: string;
    }>;
    casualties: {
      immediate: number;
      longTerm: number;
      economic: string;
    } | null;
  };
  timeLapse: {
    phases: typeof DataService.IMPACT_PHASES;
    currentPhase: number;
    isPlaying: boolean;
  };
  aftermath: {
    environmentalEffects: Array<{
      effect: string;
      timeline: string;
      severity: string;
      description: string;
    }>;
    recoveryScenarios: Array<{
      scenario: string;
      timeframe: string;
      requirements: string[];
    }>;
  };
}

export const useFeatureData = () => {
  const [data, setData] = useState<FeatureData>({
    scientificPhysics: {
      formulas: [
        {
          name: 'Kinetic Energy',
          formula: 'E = ½mv²',
          description: 'Energy released upon impact',
          example: '1km asteroid at 20km/s = 100 million megatons TNT'
        },
        {
          name: 'Crater Diameter',
          formula: 'D = 1.8 × E^0.25',
          description: 'Final crater size based on energy',
          example: '100MT impact creates ~15km crater'
        },
        {
          name: 'Damage Radius',
          formula: 'R = √(E/π) × 2',
          description: 'Area of significant destruction',
          example: '15MT impact affects 50km radius'
        },
        {
          name: 'Atmospheric Entry',
          formula: 'v² = v₀² - 2gh',
          description: 'Velocity change through atmosphere',
          example: 'Small asteroids burn up completely'
        }
      ],
      calculations: null,
      loading: false
    },
    nasaData: {
      nearEarthObjects: [],
      nextApproaches: [],
      loading: true,
      error: null
    },
    aiRisk: {
      assessment: null,
      vulnerableCities: DataService.MAJOR_CITIES.sort((a, b) => b.density_per_km2 - a.density_per_km2).slice(0, 5),
      riskMatrix: [
        { factor: 'Population Density', level: 'HIGH', impact: 'Increases casualty potential exponentially' },
        { factor: 'Infrastructure Age', level: 'MODERATE', impact: 'Older buildings more vulnerable to shock waves' },
        { factor: 'Geographic Location', level: 'VARIABLE', impact: 'Coastal cities face additional tsunami risk' },
        { factor: 'Emergency Preparedness', level: 'LOW', impact: 'Most cities lack asteroid impact protocols' },
        { factor: 'Medical Capacity', level: 'MODERATE', impact: 'Limited surge capacity for mass casualties' }
      ],
      loading: false
    },
    impactAnalysis: {
      historicalData: DataService.HISTORICAL_IMPACTS,
      damageModels: [
        {
          category: 'Thermal Radiation',
          description: 'Intense heat causing fires and burns',
          formula: 'I = E/(4πr²) × atmospheric_transmission'
        },
        {
          category: 'Shock Wave',
          description: 'Overpressure destroying structures',
          formula: 'P = P₀ × (R₀/R)^n'
        },
        {
          category: 'Seismic Effects',
          description: 'Ground shaking like major earthquake',
          formula: 'M = log₁₀(E) - 4.8'
        },
        {
          category: 'Debris Impact',
          description: 'Secondary projectiles from crater',
          formula: 'Range = v₀²sin(2θ)/g'
        }
      ],
      casualties: null
    },
    timeLapse: {
      phases: DataService.IMPACT_PHASES,
      currentPhase: 0,
      isPlaying: false
    },
    aftermath: {
      environmentalEffects: [
        {
          effect: 'Dust Cloud Formation',
          timeline: 'Minutes to Hours',
          severity: 'HIGH',
          description: 'Massive dust clouds block sunlight, causing immediate cooling'
        },
        {
          effect: 'Acid Rain',
          timeline: 'Days to Weeks',
          severity: 'MODERATE',
          description: 'Sulfur compounds create acid precipitation'
        },
        {
          effect: 'Climate Change',
          timeline: 'Months to Years',
          severity: 'EXTREME',
          description: 'Global temperature drop affects agriculture worldwide'
        },
        {
          effect: 'Ozone Depletion',
          timeline: 'Years to Decades',
          severity: 'HIGH',
          description: 'Increased UV radiation affects ecosystems'
        }
      ],
      recoveryScenarios: [
        {
          scenario: 'Local Recovery',
          timeframe: '1-5 years',
          requirements: ['Debris removal', 'Infrastructure rebuild', 'Population relocation']
        },
        {
          scenario: 'Regional Stabilization',
          timeframe: '5-20 years',
          requirements: ['Economic reconstruction', 'Agricultural adaptation', 'Climate monitoring']
        },
        {
          scenario: 'Global Adaptation',
          timeframe: '20-100 years',
          requirements: ['New agricultural methods', 'Climate engineering', 'Ecosystem restoration']
        }
      ]
    }
  });

  // Fetch NASA data on component mount
  useEffect(() => {
    const fetchNASAData = async () => {
      try {
        setData(prev => ({
          ...prev,
          nasaData: { ...prev.nasaData, loading: true, error: null }
        }));

        const neoData = await DataService.fetchNearEarthObjects();
        
        if (neoData && neoData.near_earth_objects) {
          const allNEOs: NearEarthObject[] = [];
          const nextApproaches: any[] = [];

          // Process NASA data
          Object.values(neoData.near_earth_objects).forEach((dayData: any) => {
            dayData.forEach((neo: NearEarthObject) => {
              allNEOs.push(neo);
              
              if (neo.close_approach_data && neo.close_approach_data.length > 0) {
                const approach = neo.close_approach_data[0];
                nextApproaches.push({
                  name: neo.name,
                  date: approach.close_approach_date,
                  distance: `${parseFloat(approach.miss_distance.kilometers).toLocaleString()} km`,
                  size: `${neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(3)}-${neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(3)} km`,
                  hazardous: neo.is_potentially_hazardous_asteroid
                });
              }
            });
          });

          setData(prev => ({
            ...prev,
            nasaData: {
              nearEarthObjects: allNEOs.slice(0, 10), // Limit to 10 for display
              nextApproaches: nextApproaches.slice(0, 5),
              loading: false,
              error: null
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching NASA data:', error);
        setData(prev => ({
          ...prev,
          nasaData: {
            ...prev.nasaData,
            loading: false,
            error: 'Failed to fetch NASA data. Using demo data.'
          }
        }));
      }
    };

    fetchNASAData();
  }, []);

  // Calculate physics data for a sample asteroid
  useEffect(() => {
    const sampleCalculation = DataService.calculateImpactPhysics(
      0.5, // 500m diameter
      20,  // 20 km/s velocity
      2600, // Standard asteroid density
      8000000 // NYC population
    );

    setData(prev => ({
      ...prev,
      scientificPhysics: {
        ...prev.scientificPhysics,
        calculations: sampleCalculation
      },
      impactAnalysis: {
        ...prev.impactAnalysis,
        casualties: {
          immediate: sampleCalculation.casualties_estimate,
          longTerm: Math.round(sampleCalculation.casualties_estimate * 1.5),
          economic: `$${(sampleCalculation.energy_megatons * 10).toFixed(1)} billion`
        }
      }
    }));

    // Generate AI risk assessment
    const riskAssessment = DataService.generateAIRiskAssessment(
      {
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 0.4,
            estimated_diameter_max: 0.6
          }
        }
      },
      DataService.MAJOR_CITIES[0], // NYC
      sampleCalculation
    );

    setData(prev => ({
      ...prev,
      aiRisk: {
        ...prev.aiRisk,
        assessment: riskAssessment
      }
    }));
  }, []);

  // Time-lapse simulation controls
  const playTimeLapse = () => {
    setData(prev => ({
      ...prev,
      timeLapse: { ...prev.timeLapse, isPlaying: true }
    }));

    const interval = setInterval(() => {
      setData(prev => {
        const nextPhase = prev.timeLapse.currentPhase + 1;
        if (nextPhase >= prev.timeLapse.phases.length) {
          clearInterval(interval);
          return {
            ...prev,
            timeLapse: { ...prev.timeLapse, isPlaying: false, currentPhase: 0 }
          };
        }
        return {
          ...prev,
          timeLapse: { ...prev.timeLapse, currentPhase: nextPhase }
        };
      });
    }, 2000); // 2 seconds per phase
  };

  const resetTimeLapse = () => {
    setData(prev => ({
      ...prev,
      timeLapse: { ...prev.timeLapse, currentPhase: 0, isPlaying: false }
    }));
  };

  return {
    data,
    actions: {
      playTimeLapse,
      resetTimeLapse,
      refreshNASAData: () => {
        // Re-fetch NASA data
        setData(prev => ({
          ...prev,
          nasaData: { ...prev.nasaData, loading: true }
        }));
      }
    }
  };
};