// Enhanced Educational Data with NASA Integration
// This file provides detailed content for educational cards with real NASA data and research

import { DetailedEducationCard } from '../services/educationApiClient';

export const ENHANCED_EDUCATION_DATA: DetailedEducationCard[] = [
  {
    id: 'scientific-physics',
    title: 'Scientific Physics',
    emoji: '⚛️',
    difficulty: 'advanced',
    readingTime: 8,
    category: 'science',
    description: 'Explore the fundamental physics principles governing asteroid behavior, from orbital mechanics to atmospheric entry dynamics, using real NASA data and calculations.',
    gradient: 'from-blue-500 to-purple-600',
    detailed_sections: [
      {
        title: 'Kinetic Energy & Impact Physics',
        content: 'The energy released during an asteroid impact follows the fundamental kinetic energy equation E = ½mv². This seemingly simple formula becomes tremendously complex when applied to real astronomical objects traveling at cosmic velocities. For asteroid 99942 Apophis, with a diameter of 375 meters and traveling at 30.73 km/s, the impact energy would equal approximately 1,151 megatons of TNT - equivalent to 77,000 Hiroshima bombs detonating simultaneously.',
        subsections: [
          {
            title: 'Energy Scaling Laws',
            text: 'Small increases in velocity create exponentially larger energy releases. A 10% velocity increase results in 21% more energy, while doubling velocity quadruples the impact energy. This is why asteroid detection and precise velocity measurements are crucial for impact assessment.'
          },
          {
            title: 'Mass-Energy Relationships',
            text: 'Asteroid mass is calculated from volume (4/3πr³) multiplied by density. Typical densities range from 1.3 g/cm³ for C-type asteroids to 5.3 g/cm³ for M-type metallic asteroids. Bennu, at 492m diameter, has a mass of 78 billion kg.'
          }
        ]
      },
      {
        title: 'Atmospheric Entry Dynamics',
        content: 'When asteroids enter Earth\'s atmosphere at hypersonic speeds (11.2-72.8 km/s), they experience extreme heating due to shock wave formation rather than friction. The shock wave compresses air in front of the object, creating temperatures of 1,650-5,800°C - hot enough to create plasma that can be brighter than the Sun.',
        subsections: [
          {
            title: 'Ablation Process',
            text: 'Material vaporizes from the asteroid\'s surface during atmospheric passage. Smaller objects lose mass rapidly and may completely disintegrate, while larger objects retain significant mass for ground impact.'
          },
          {
            title: 'Fragmentation Mechanics',
            text: 'Structural stress from atmospheric pressure and internal heating causes asteroids to break apart. The fragmentation process depends on material composition, internal structure, and entry angle.'
          }
        ]
      },
      {
        title: 'Orbital Mechanics & Trajectory Analysis',
        content: 'Asteroid orbits follow Kepler\'s laws of planetary motion. The orbital period T = 2π√(a³/GM), where a is the semi-major axis and GM is the gravitational parameter of the Sun. Apophis\'s 323.6-day orbit demonstrates perfect elliptical motion physics, with its closest approach to the Sun at 0.746 AU and farthest at 1.099 AU.',
        subsections: [
          {
            title: 'Gravitational Perturbations',
            text: 'Asteroid orbits are modified by gravitational influences from planets. Jupiter\'s massive gravity field particularly affects asteroid trajectories, sometimes deflecting objects into Earth-crossing orbits through orbital resonances.'
          },
          {
            title: 'Non-gravitational Forces',
            text: 'The Yarkovsky effect, caused by thermal radiation, can slowly change asteroid orbits over thousands of years. This effect is crucial for long-term impact risk assessment and must be included in trajectory calculations.'
          }
        ]
      }
    ],
    interactive_elements: [
      {
        type: 'real_asteroids',
        title: 'NASA-Tracked Near-Earth Asteroids',
        data: [
          { name: '99942 Apophis', diameter: 0.375, type: 'Potentially Hazardous' },
          { name: '101955 Bennu', diameter: 0.492, type: 'Sample Return Target' },
          { name: '162173 Ryugu', diameter: 0.900, type: 'Sample Return Target' },
          { name: '4179 Toutatis', diameter: 5.4, type: 'Largest PHA' },
          { name: '1566 Icarus', diameter: 1.4, type: 'Apollo Group' }
        ]
      }
    ],
    recent_discoveries: [
      {
        date: '2023-12-15',
        title: '2023 YR Discovery',
        description: 'NEOWISE discovered this 50-meter asteroid with unusual high-albedo composition, suggesting metallic content similar to rare M-type asteroids.'
      },
      {
        date: '2023-11-08',
        title: 'Dimorphos Post-DART Analysis',
        description: 'New findings show DART impact created a sustained debris cloud and altered Dimorphos\'s shape, providing insights into asteroid internal structure.'
      }
    ],
    related_missions: [
      {
        name: 'DART (Double Asteroid Redirection Test)',
        target: 'Dimorphos',
        status: 'Mission Complete - Success'
      },
      {
        name: 'OSIRIS-REx',
        target: 'Bennu Sample Return',
        status: 'Sample Returned 2023'
      },
      {
        name: 'NEO Surveyor',
        target: 'Infrared NEO Discovery',
        status: 'Launch Scheduled 2028'
      }
    ]
  },
  {
    id: 'live-nasa-data',
    title: 'Live NASA Data',
    emoji: '📊',
    difficulty: 'intermediate',
    readingTime: 6,
    category: 'science',
    description: 'Access real-time NASA data feeds including near-Earth object tracking, discovery statistics, and current space weather conditions affecting asteroid observations.',
    gradient: 'from-green-500 to-blue-500',
    detailed_sections: [
      {
        title: 'Real-time NEO Tracking Network',
        content: 'NASA operates a comprehensive network of ground-based and space-based telescopes that continuously monitor near-Earth objects. The network includes the Catalina Sky Survey, LINEAR, NEOWISE space telescope, and international partners. Currently, over 34,000 asteroids are being tracked, with approximately 2,300 classified as potentially hazardous.',
        subsections: [
          {
            title: 'Discovery Statistics',
            text: 'The Catalina Sky Survey leads NEO discoveries, contributing 47% of all new detections. NEOWISE space telescope discovers approximately 30 new objects weekly using infrared detection methods. The discovery rate continues to accelerate with improved technology.'
          },
          {
            title: 'Observation Precision',
            text: 'Modern tracking achieves position accuracy within 100 meters for well-observed asteroids. The former Arecibo radar system provided velocity measurements precise to 0.1 mm/s before its collapse in 2020.'
          }
        ]
      },
      {
        title: 'Current Asteroid Inventory',
        content: 'NASA has achieved 90.8% completeness for discovering asteroids larger than 1 kilometer - those capable of global damage. For the 140-meter to 1-kilometer size range, approximately 40% have been discovered, representing about 25,000 objects. Millions of smaller asteroids remain undiscovered.',
        subsections: [
          {
            title: 'Size Distribution Analysis',
            text: 'The asteroid population follows a power law distribution. For every asteroid larger than 1km, there are roughly 1,000 objects larger than 100m, and 1 million objects larger than 10m.'
          },
          {
            title: 'Hazard Assessment Progress',
            text: 'Objects larger than 1km could cause global effects and represent the highest priority for discovery. The 140m threshold represents objects capable of regional devastation, making them the current focus of survey programs.'
          }
        ]
      },
      {
        title: 'Real-time Monitoring Systems',
        content: 'NASA\'s continuous monitoring includes close approach tracking, fireball detection networks, and space weather monitoring that affects observation conditions. The All-Sky Fireball Network detects approximately 40 fireballs every night, providing data on small asteroid populations.',
        subsections: [
          {
            title: 'Close Approach Alerts',
            text: 'Asteroids passing within 0.05 AU (7.5 million kilometers) are continuously monitored. Recent notable close approaches include 2023 BU, which passed just 3,600 km from Earth on January 26, 2023.'
          },
          {
            title: 'Fireball Data Analysis',
            text: 'Fireball detections provide crucial data on the small asteroid population. Recent analysis of a 1-meter meteoroid over Pennsylvania showed it generated energy equivalent to 30 tons of TNT upon atmospheric entry.'
          }
        ]
      }
    ],
    interactive_elements: [
      {
        type: 'live_stats',
        title: 'Current NEO Statistics (Updated Daily)',
        data: [
          { name: 'Total Tracked NEOs', diameter: 34000, type: 'Count' },
          { name: 'Potentially Hazardous', diameter: 2300, type: 'Count' },
          { name: 'Weekly Discoveries', diameter: 30, type: 'Rate' },
          { name: '1km+ Completeness', diameter: 90.8, type: 'Percentage' },
          { name: 'Discovery Rate Increase', diameter: 15, type: 'Percentage/Year' }
        ]
      }
    ]
  },
  {
    id: 'ai-risk-analyser',
    title: 'AI Risk Analyser',
    emoji: '🤖',
    difficulty: 'advanced',
    readingTime: 7,
    category: 'defense',
    description: 'Understand how artificial intelligence and machine learning models assess asteroid impact risks, calculate threat levels, and predict potential consequences using advanced algorithms.',
    gradient: 'from-red-500 to-orange-500',
    detailed_sections: [
      {
        title: 'Machine Learning Impact Models',
        content: 'NASA employs sophisticated ensemble methods that combine orbital dynamics, observational uncertainty, and impact probability calculations. These AI systems run Monte Carlo simulations with over 10,000 trajectory variations to account for measurement uncertainties and model the range of possible outcomes.',
        subsections: [
          {
            title: 'Sentry-II Risk Assessment System',
            text: 'The latest version of NASA\'s impact monitoring system uses advanced algorithms to continuously evaluate asteroid trajectories. It automatically updates risk assessments as new observations become available, improving prediction accuracy over time.'
          },
          {
            title: 'Ensemble Prediction Methods',
            text: 'Multiple independent models are combined to create more robust predictions. Each model considers different aspects like gravitational perturbations, non-gravitational forces, and observation uncertainties to provide confidence intervals for impact predictions.'
          }
        ]
      },
      {
        title: 'Risk Scaling Systems',
        content: 'Two primary scales are used for asteroid risk communication: the Torino Scale and the Palermo Scale. The Torino Scale provides a simple 0-10 rating combining impact probability with kinetic energy, while the Palermo Scale offers logarithmic precision comparing impact probability to background risk levels.',
        subsections: [
          {
            title: 'Torino Scale Implementation',
            text: 'AI calculates impact probability multiplied by kinetic energy to determine Torino Scale ratings. Scale 10 represents certain collision causing global catastrophe. Apophis previously scored 4 during its 2029 approach predictions before being downgraded to 0.'
          },
          {
            title: 'Palermo Scale Precision',
            text: 'The logarithmic Palermo Scale compares impact probability to background risk. Values greater than -2 require attention and possible mitigation planning. AI processes over 200 variables including the Yarkovsky thermal drift effect.'
          }
        ]
      },
      {
        title: 'Population and Infrastructure Risk Assessment',
        content: 'AI models correlate potential impact zones with population density, urban infrastructure, and evacuation capabilities. These systems factor in building collapse patterns, fire propagation, and emergency response logistics to estimate casualty rates and economic damage.',
        subsections: [
          {
            title: 'Urban Impact Modeling',
            text: 'City-specific models account for building types, population density patterns, and emergency response capabilities. Different building codes and construction materials significantly affect casualty estimates for the same impact scenario.'
          },
          {
            title: 'Economic Impact Assessment',
            text: 'AI systems estimate direct damage costs plus indirect economic effects like supply chain disruption, insurance losses, and long-term regional economic impacts. These models help prioritize mitigation efforts and emergency planning.'
          }
        ]
      }
    ],
    calculators: [
      {
        type: 'risk_calculator',
        title: 'Impact Risk Calculator',
        parameters: ['Asteroid Diameter', 'Velocity', 'Impact Location', 'Population Density'],
        outputs: ['Torino Scale Rating', 'Palermo Scale Value', 'Estimated Casualties', 'Economic Damage']
      }
    ]
  },
  {
    id: 'impact-analyser',
    title: 'Impact Analyser',
    emoji: '🎯',
    difficulty: 'advanced',
    readingTime: 8,
    category: 'science',
    description: 'Analyze the physics and consequences of asteroid impacts using NASA damage assessment models, from crater formation to global environmental effects.',
    gradient: 'from-orange-500 to-red-600',
    detailed_sections: [
      {
        title: 'Impact Physics and Energy Transfer',
        content: 'Asteroid impacts release enormous amounts of kinetic energy in microseconds. The Collins-Melosh-Marcus equations model how this energy creates shock waves, thermal radiation, and ejecta. A 1-kilometer iron asteroid traveling at typical speeds creates a destruction zone extending 100 kilometers from the impact site.',
        subsections: [
          {
            title: 'Shock Wave Propagation',
            text: 'Initial shock waves travel faster than sound, creating overpressure that can collapse buildings and cause widespread destruction. The intensity decreases with distance following established scaling laws based on energy and local geology.'
          },
          {
            title: 'Thermal Radiation Effects',
            text: 'The fireball created by impact generates intense thermal radiation that can cause burns and ignite fires over vast areas. The thermal pulse duration and intensity depend on impact energy and atmospheric conditions.'
          }
        ]
      },
      {
        title: 'Crater Formation and Geology',
        content: 'Impact craters form through a complex process involving compression, excavation, and modification phases. Simple craters are bowl-shaped for diameters up to 2-4 km on Earth, while larger impacts create complex craters with central peaks and terraced walls. The famous Chicxulub crater (180 km diameter) formed from a 10-15 km asteroid impact.',
        subsections: [
          {
            title: 'Crater Scaling Relationships',
            text: 'Crater diameter relationships follow established scaling laws based on impact energy, target material properties, and gravity. These equations allow scientists to estimate impactor size from crater measurements and vice versa.'
          },
          {
            title: 'Ejecta and Debris Distribution',
            text: 'Impact ejecta follows ballistic trajectories, with larger fragments landing closer to the crater and fine material distributed globally. The ejecta mass typically exceeds the impactor mass by factors of hundreds to thousands.'
          }
        ]
      },
      {
        title: 'Environmental and Climatic Effects',
        content: 'Large impacts can cause environmental changes lasting from months to millions of years. Impacts larger than 1 km inject dust into the stratosphere, blocking sunlight and causing global cooling. Impacts exceeding 10 km in diameter can cause "impact winters" lasting years, with severe consequences for global ecosystems.',
        subsections: [
          {
            title: 'Atmospheric Dust Loading',
            text: 'Fine particles injected into the atmosphere scatter sunlight, reducing surface temperatures. The amount and duration of cooling depend on particle size distribution and injection altitude into the atmosphere.'
          },
          {
            title: 'Ocean Impact Effects',
            text: '70% of Earth\'s surface is ocean, making marine impacts statistically most likely. Ocean impacts generate tsunamis that can cause devastation across entire ocean basins, while also injecting water vapor into the atmosphere.'
          }
        ]
      }
    ],
    impact_timeline: [
      {
        age: '66 Ma',
        event: 'Chicxulub Impact',
        description: '10-15 km asteroid creates 180 km crater, ends Cretaceous period and non-avian dinosaurs'
      },
      {
        age: '214 Ma',
        event: 'Manicouagan Impact',
        description: '100 km crater in Canada, may have contributed to late Triassic extinction'
      },
      {
        age: '1908 CE',
        event: 'Tunguska Event',
        description: '60m asteroid airburst flattens 2,000 km² of Siberian forest'
      },
      {
        age: '2013 CE',
        event: 'Chelyabinsk Impact',
        description: '20m asteroid airburst injures 1,500 people through glass damage'
      }
    ]
  },
  {
    id: 'time-lapse-simulation',
    title: 'Time-lapse Simulation',
    emoji: '⏱️',
    difficulty: 'intermediate',
    readingTime: 6,
    category: 'science',
    description: 'Visualize asteroid trajectories and orbital evolution over different timescales, from seconds-long atmospheric entry to million-year orbital migrations.',
    gradient: 'from-purple-500 to-pink-500',
    detailed_sections: [
      {
        title: 'Orbital Evolution Over Deep Time',
        content: 'Asteroids migrate from the main belt between Mars and Jupiter over millions of years through complex gravitational interactions. Jupiter\'s powerful gravity creates Kirkwood gaps at specific orbital resonances, particularly the 3:1 resonance which pumps orbital eccentricity and delivers asteroids into Earth-crossing orbits.',
        subsections: [
          {
            title: 'Kirkwood Gap Dynamics',
            text: 'These gaps in the asteroid belt occur at orbital periods that are simple fractions of Jupiter\'s period. Asteroids in these resonances experience regular gravitational kicks that gradually increase their orbital eccentricity until they become Earth-crossers.'
          },
          {
            title: 'Yarkovsky Drift',
            text: 'Thermal radiation creates a small but persistent force that can significantly change asteroid orbits over thousands of years. This effect is particularly important for smaller asteroids and must be included in long-term trajectory calculations.'
          }
        ]
      },
      {
        title: 'Detection to Impact Timeline',
        content: 'Warning times for asteroid impacts depend critically on object size and current survey capabilities. Large 1-kilometer objects typically provide decades of warning once discovered, while 100-meter objects might give years, and small 10-meter objects often only hours. The DART mission exemplifies the decade-long timeline from concept to impact.',
        subsections: [
          {
            title: 'Survey Detection Capabilities',
            text: 'Current ground-based surveys can detect large asteroids years before impact, but smaller objects may only be discovered days or hours before impact. Space-based infrared surveys like NEO Surveyor will significantly improve detection capabilities.'
          },
          {
            title: 'Mission Planning Timescales',
            text: 'Deflection missions require years to decades for planning, construction, and flight time. This emphasizes the importance of early detection to provide sufficient warning time for effective planetary defense responses.'
          }
        ]
      },
      {
        title: 'Atmospheric Entry Physics Timeline',
        content: 'The entire atmospheric entry process, from first contact with the atmosphere to ground impact or airburst, occurs in just 2-10 seconds for most asteroids. During this brief time, hypersonic speeds (Mach 25-40) create shock heating, ablation, fragmentation, and the spectacular fireball phenomena observed from the ground.',
        subsections: [
          {
            title: 'Entry Phase Analysis',
            text: 'Entry begins at approximately 100 km altitude where atmospheric density becomes sufficient to create noticeable drag. The peak heating and ablation occur at 40-60 km altitude, with fragmentation often happening at 20-30 km altitude.'
          },
          {
            title: 'Ground Track Visualization',
            text: 'Asteroid entry creates a ground track several hundred kilometers long as the object travels through the atmosphere. The visible fireball can be seen across areas of thousands of square kilometers.'
          }
        ]
      }
    ],
    mission_timeline: [
      {
        year: '2011',
        event: 'DART Mission Concept',
        description: 'NASA begins developing the Double Asteroid Redirection Test as a planetary defense demonstration'
      },
      {
        year: '2021',
        event: 'DART Launch',
        description: 'SpaceX Falcon 9 launches DART spacecraft toward Dimorphos asteroid'
      },
      {
        year: '2022',
        event: 'DART Impact Success',
        description: 'Successful kinetic impact changes Dimorphos orbital period by 32 minutes'
      },
      {
        year: '2026',
        event: 'Hera Mission Launch',
        description: 'ESA Hera mission launches to study DART impact effects in detail'
      }
    ]
  },
  {
    id: 'aftermath-visualization',
    title: 'Aftermath Visualization',
    emoji: '👁️',
    difficulty: 'intermediate',
    readingTime: 7,
    category: 'history',
    description: 'Examine the long-term consequences of asteroid impacts through geological evidence, environmental effects, and ecosystem recovery patterns from past events.',
    gradient: 'from-gray-600 to-red-700',
    detailed_sections: [
      {
        title: 'Geological Evidence of Ancient Impacts',
        content: 'The geological record preserves evidence of major impact events in rock layers worldwide. The most famous is the K-Pg boundary layer, which contains elevated iridium concentrations, shocked quartz grains, and microscopic spherules created by the Chicxulub impact 66 million years ago. These signatures help scientists identify and study ancient impact events.',
        subsections: [
          {
            title: 'Impact Signatures in Rock',
            text: 'Shocked minerals like stishovite and coesite form only under the extreme pressures of meteorite impacts. Shatter cones and planar deformation features in rocks provide additional evidence for identifying ancient impact sites.'
          },
          {
            title: 'Global Distribution of Evidence',
            text: 'Large impacts distribute evidence globally. The Chicxulub impact spread debris across North America as a thick layer, with thinner deposits found worldwide, demonstrating the global reach of major impact events.'
          }
        ]
      },
      {
        title: 'Environmental Consequences and Recovery',
        content: 'Major impacts cause environmental devastation followed by long recovery periods. The Chicxulub impact triggered global wildfires, acid rain, ozone depletion, and nuclear winter effects that contributed to the extinction of 75% of Earth\'s species, including all non-avian dinosaurs. Ecosystem recovery from such events typically requires 5-10 million years.',
        subsections: [
          {
            title: 'Immediate Environmental Effects',
            text: 'Large impacts cause immediate global effects including widespread fires ignited by thermal radiation, acid rain from vaporized sulfur compounds, and ozone depletion from nitrogen oxides created by shock heating.'
          },
          {
            title: 'Long-term Climate Effects',
            text: 'Dust injection into the stratosphere blocks sunlight for months to years, causing global cooling and disrupting photosynthesis. This "impact winter" effect severely stresses ecosystems and food chains.'
          }
        ]
      },
      {
        title: 'Modern Impact Examples and Preservation',
        content: 'Recent impacts provide insights into impact processes and preservation. The 1908 Tunguska event flattened 2,000 square kilometers of Siberian forest but created no crater due to airburst. The 2013 Chelyabinsk event injured 1,500 people through glass damage and left meteorite fragments in Lake Chebarkul, demonstrating how even small impacts can cause significant damage in populated areas.',
        subsections: [
          {
            title: 'Crater Preservation on Earth',
            text: 'Earth\'s active geology erases impact craters through erosion and tectonics. Only about 190 impact craters are currently recognized on Earth, compared to thousands preserved on the Moon\'s inactive surface.'
          },
          {
            title: 'Atmospheric vs. Ground Impacts',
            text: 'Many asteroids explode in the atmosphere rather than reaching the ground. These airbursts can still cause significant damage, as demonstrated by Tunguska and Chelyabinsk, while leaving no permanent crater.'
          }
        ]
      }
    ]
  }
];

// Function to get enhanced education data by ID
export const getEnhancedEducationData = (id: string): DetailedEducationCard | undefined => {
  return ENHANCED_EDUCATION_DATA.find(card => card.id === id);
};

// Function to get all enhanced education cards
export const getAllEnhancedEducationData = (): DetailedEducationCard[] => {
  return ENHANCED_EDUCATION_DATA;
};