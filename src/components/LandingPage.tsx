import React, { useState } from 'react';
import {
  Zap,
  Globe,
  Calculator,
  BookOpen,
  ArrowDown,
  Brain,
  Clock,
  Target,
  Satellite,
  AlertTriangle,
  TrendingUp,
  X,
  ArrowLeft
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

type FeatureId = 'scientific-physics' | 'nasa-data' | 'ai-risk' | 'impact-analysis' | 'time-lapse' | 'aftermath';

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureId | null>(null);

  // Feature information with comprehensive NASA-integrated educational content
  const featureDetails = {
    'scientific-physics': {
      title: 'Scientific Physics',
      icon: Calculator,
      color: 'text-green-400',
      gradient: 'from-blue-500 to-purple-600',
      content: {
        overview: 'Explore the fundamental physics principles governing asteroid behavior using real NASA data and calculations. Our physics engine incorporates kinetic energy formulas, orbital mechanics, and atmospheric entry dynamics to provide scientifically accurate impact modeling.',
        features: [
          'Kinetic Energy Formula: E = ½mv² - For asteroid 99942 Apophis (375m diameter, 30.73 km/s), impact energy equals ~1,151 megatons TNT',
          'Atmospheric Entry Physics: Objects entering at 11.2-72.8 km/s experience temperatures of 1,650-5,800°C creating plasma brighter than the Sun',
          'Orbital Mechanics: Asteroid trajectories follow Kepler\'s laws with Period T = 2π√(a³/GM) - Apophis\' 323.6-day orbit demonstrates elliptical motion',
          'Impact Cratering: Crater diameter D ≈ 1.8 × (Energy/ρg)^0.22 where a 1km asteroid creates ~20km crater, ejecting 1000× its mass',
          'Material Composition: C-type (75%), S-type (17%), M-type (8%) asteroids have different fragmentation patterns during atmospheric entry',
          'Detection Physics: Asteroids detected by reflected sunlight with diameter D(km) ≈ 1329/√(albedo) × 10^(-0.2H)'
        ],
        technicalDetails: 'Our physics calculations are based on validated NASA models including the Collins-Melosh-Marcus impact equations, atmospheric entry ablation models, and orbital dynamics from JPL\'s Small-Body Database. The system incorporates momentum transfer efficiency data from the successful DART mission, which achieved Δv = 2.14 mm/s on Dimorphos.',
        applications: 'These physics principles enable accurate prediction of impact energy, crater formation, atmospheric effects, and orbital evolution. The simulator uses Monte Carlo methods with 10,000+ trajectory variations to account for measurement uncertainties and model realistic impact scenarios.'
      }
    },
    'nasa-data': {
      title: 'Live NASA Data',
      icon: Satellite,
      color: 'text-purple-400',
      gradient: 'from-green-500 to-blue-500',
      content: {
        overview: 'Access real-time NASA data feeds including Near-Earth Object tracking, discovery statistics, and current space weather conditions. Our system integrates with NASA\'s comprehensive network of ground-based and space-based telescopes that continuously monitor over 34,000 asteroids.',
        features: [
          'Real-time NEO Tracking: NASA tracks 34,000+ asteroids with 2,300+ potentially hazardous, NEOWISE discovers ~30 new objects weekly',
          'Current Statistics: 90.8% of 1km+ NEOs discovered, Catalina Sky Survey leads with 47% of discoveries, LINEAR contributed 147,000+ observations',
          'Close Approach Monitoring: Real-time tracking of asteroids within 0.05 AU (7.5M km) - 2023 BU passed just 3,600 km from Earth',
          'Fireball Network: NASA\'s All-Sky Network detects ~40 fireballs nightly, recent 1m meteoroid over Pennsylvania generated 30-ton TNT energy',
          'Size Distribution: 2,300 objects >1km (99% complete), 25,000 objects 140m-1km (40% complete), millions of smaller objects undiscovered',
          'Observation Precision: Deep Space Network achieves 100m position accuracy, former Arecibo provided 0.1 mm/s velocity precision'
        ],
        technicalDetails: 'Data integration includes live feeds from the Catalina Sky Survey, LINEAR, NEOWISE space telescope, and international partners. The system processes orbital elements, close approach data, physical parameters, and hazard assessments from NASA\'s JPL Center for NEO Studies and Sentry impact monitoring system.',
        applications: 'Live NASA data enhances simulation realism by providing actual asteroid parameters, current threat assessments, and real-world context. Users can simulate impacts using real asteroids like Apophis, Bennu, or recently discovered objects with their authentic orbital and physical properties.'
      }
    },
    'ai-risk': {
      title: 'AI Risk Analyzer',
      icon: Brain,
      color: 'text-cyan-400',
      gradient: 'from-red-500 to-orange-500',
      content: {
        overview: 'Advanced artificial intelligence and machine learning models assess asteroid impact risks, calculate threat levels, and predict potential consequences using NASA\'s Sentry-II system algorithms and population vulnerability analysis.',
        features: [
          'Machine Learning Models: NASA uses ensemble methods combining orbital dynamics, observational uncertainty, Monte Carlo simulations with 10,000+ trajectory variations',
          'Torino Scale Algorithm: AI calculates impact probability × kinetic energy, Scale 0-10 where Apophis previously scored 4 for 2029 approach',
          'Palermo Scale Precision: Logarithmic scale comparing impact probability to background risk, AI processes 200+ variables including Yarkovsky drift',
          'Population Risk Assessment: AI correlates impact zones with population density, urban infrastructure, building collapse patterns, evacuation logistics',
          'Real-time Risk Updates: Sentry-II continuously updates assessments, 2022 AP7 discovery triggered immediate orbital refinement and evaluation',
          'Behavioral Analysis: AI predicts non-gravitational forces (Yarkovsky effect) affecting orbits over decades using thermal modeling'
        ],
        technicalDetails: 'The AI system implements NASA\'s Sentry-II impact monitoring algorithms with advanced ensemble prediction methods. Multiple independent models consider gravitational perturbations, non-gravitational forces, and observation uncertainties to provide confidence intervals and automated risk updates as new observations become available.',
        applications: 'AI risk analysis enables automated threat assessment, early warning systems, and decision support for planetary defense. The system helps prioritize observation efforts, evacuation planning, and mitigation strategies based on comprehensive risk modeling and population vulnerability analysis.'
      }
    },
    'impact-analysis': {
      title: 'Impact Analysis',
      icon: Target,
      color: 'text-red-400',
      gradient: 'from-orange-500 to-red-600',
      content: {
        overview: 'Comprehensive analysis of asteroid impact physics and consequences using NASA damage assessment models. From crater formation to global environmental effects, explore the full spectrum of impact scenarios and their implications.',
        features: [
          'Damage Assessment Models: Collins-Melosh-Marcus equations calculate blast radius, thermal effects, seismic damage - 1km iron asteroid creates 100km destruction zone',
          'Crater Formation Physics: Complex craters form when D > 2-4km on Earth, Chicxulub crater (180km) formed by 10-15km asteroid ejecting debris globally',
          'Energy Scaling Laws: Surface burst energy = 0.5 × ρ × V³ × (4/3)πr³, air burst energy reduced by atmospheric absorption',
          'Geographic Impact Zones: Ocean impacts (70% probability) generate tsunamis, land impacts create ejecta blankets, wildfires, atmospheric dust loading',
          'Atmospheric Effects: 1km+ impacts inject dust into stratosphere blocking sunlight for months, 10km+ impacts cause "impact winter" lasting years',
          'Casualty Estimation: Models factor population density, building types, warning time - Chelyabinsk injured 1,500, Tunguska zero due to remote location'
        ],
        technicalDetails: 'Impact analysis uses validated scaling laws from nuclear test data, laboratory experiments, and geological evidence from impact craters. The system incorporates atmospheric modeling, structural damage assessment, and casualty estimation algorithms based on building codes, population density, and emergency response capabilities.',
        applications: 'Impact analysis supports emergency planning, infrastructure assessment, and policy development. The models help quantify risks, estimate damage costs, plan evacuation zones, and develop mitigation strategies for different impact scenarios and urban environments.'
      }
    },
    'time-lapse': {
      title: 'Time-Lapse Simulation',
      icon: Clock,
      color: 'text-orange-400',
      gradient: 'from-purple-500 to-pink-500',
      content: {
        overview: 'Visualize asteroid trajectories and orbital evolution across different timescales, from seconds-long atmospheric entry to million-year orbital migrations. Experience the complete timeline from detection to aftermath.',
        features: [
          'Orbital Evolution: Asteroids migrate from main belt via Kirkwood gaps over millions of years, Jupiter\'s 3:1 resonance delivers NEOs to Earth-crossing orbits',
          'Detection Timeline: 1km objects = decades warning, 100m objects = years, 10m objects = hours, DART mission took 10 years from concept to impact',
          'Atmospheric Entry: Hypersonic entry (Mach 25-40) → shock heating → ablation → fragmentation → airburst/impact in 2-10 seconds',
          'Trajectory Visualization: Real asteroid paths plotted in 4D (x,y,z,time), Apophis\'s 2029 flyby changes orbit affecting 2036 approach',
          'Multi-Body Simulation: N-body integrations include Sun, planets, moon gravity plus relativistic effects and radiation pressure over millennia',
          'Statistical Evolution: Monte Carlo methods simulate observation uncertainty, probability clouds shrink with more observations improving predictions'
        ],
        technicalDetails: 'Time-lapse simulation uses numerical integration of the N-body problem with perturbation theory to model long-term orbital evolution. High-precision ephemerides from JPL provide accurate planetary positions, while Monte Carlo methods account for observation uncertainties and chaotic dynamics.',
        applications: 'Time-lapse visualization helps understand asteroid evolution, mission planning timescales, and the urgency of early detection. The system demonstrates how small orbital changes accumulate over time and why long-term predictions require continuous observation refinement.'
      }
    },
    'aftermath': {
      title: 'Aftermath Visualization',
      icon: TrendingUp,
      color: 'text-yellow-400',
      gradient: 'from-gray-600 to-red-700',
      content: {
        overview: 'Examine long-term consequences of asteroid impacts through geological evidence, environmental effects, and ecosystem recovery patterns. Learn from past events and understand the full scope of impact aftermath.',
        features: [
          'Geological Record: Iridium layers mark impact events, K-Pg boundary contains shocked quartz and spherules from Chicxulub impact 66 million years ago',
          'Environmental Consequences: Chicxulub caused global wildfires, acid rain, ozone depletion, nuclear winter - 75% species extinction including dinosaurs',
          'Crater Morphology: Fresh craters show central peaks, terraced walls, ejecta rays - lunar craters preserve history, Earth\'s erode via weathering',
          'Shock Metamorphism: High-pressure minerals (stishovite, coesite) form only in impacts, shatter cones identify ancient impact sites',
          'Recovery Timescales: Ecosystem recovery takes 5-10 million years for major impacts, decades for small impacts, Barringer Crater pristine after 50,000 years',
          'Modern Examples: Tunguska (1908) flattened 2,000 km² forest, Chelyabinsk (2013) shattered windows across 6 cities creating Lake Chebarkul fragment'
        ],
        technicalDetails: 'Aftermath analysis combines paleontological evidence, geochemical signatures, and impact modeling to understand long-term consequences. The system incorporates climate modeling, extinction patterns, and geological preservation to demonstrate how impacts shape planetary evolution.',
        applications: 'Aftermath visualization provides context for impact risks and helps communicate the long-term implications of asteroid impacts. Understanding recovery timescales and environmental effects supports policy decisions about planetary defense investments and emergency preparedness.'
      }
    }
  };

  const handleFeatureClick = (featureId: FeatureId) => {
    setSelectedFeature(featureId);
  };

  const closeFeatureDetail = () => {
    setSelectedFeature(null);
  };

  // If a feature is selected, show the detailed view
  if (selectedFeature) {
    const feature = featureDetails[selectedFeature];
    const IconComponent = feature.icon;
    
    return (
      <div className="min-h-screen text-white relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black via-[#020111] to-[#05103a]"></div>
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={closeFeatureDetail}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Features</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gradient-to-r ${feature.gradient}`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">{feature.title}</h1>
            </div>
            
            <button
              onClick={onEnterApp}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full hover:scale-105 transition-transform duration-300"
            >
              Launch Simulator
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="glass-card p-8">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${feature.gradient}`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  Overview
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {feature.content.overview}
                </p>
              </div>

              {/* Technical Details */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Technical Details</h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.content.technicalDetails}
                </p>
              </div>

              {/* Applications */}
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-6 text-white">Applications</h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.content.applications}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Features */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Key Features</h3>
                <ul className="space-y-3">
                  {feature.content.features.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${feature.gradient} flex-shrink-0`}></div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={onEnterApp}
                    className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:scale-105 transition-transform duration-300 font-semibold"
                  >
                    Try This Feature
                  </button>
                  <button
                    onClick={closeFeatureDetail}
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
                  >
                    Explore Other Features
                  </button>
                </div>
              </div>

              {/* Related Features */}
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Related Features</h3>
                <div className="space-y-2">
                  {Object.entries(featureDetails)
                    .filter(([id]) => id !== selectedFeature)
                    .slice(0, 3)
                    .map(([id, details]) => {
                      const RelatedIcon = details.icon;
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedFeature(id as FeatureId)}
                          className="w-full p-3 flex items-center gap-3 hover:bg-white/5 rounded-lg transition-colors duration-300 text-left"
                        >
                          <RelatedIcon className={`w-4 h-4 ${details.color}`} />
                          <span className="text-sm text-gray-300">{details.title}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Hero Section */}
      <div className="text-center z-10 max-w-4xl mx-auto px-6">
        {/* Main Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="p-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full shadow-2xl animate-pulse-glow">
              <Zap className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent text-glow animate-pulse">
          METEOR IMPACT
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          SIMULATOR
        </h2>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          Experience the devastating power of asteroid impacts with scientific accuracy.
          Featuring AI-powered risk analysis, real NASA data, interactive 3D Earth visualization,
          and comprehensive impact modeling. Explore cosmic consequences, learn planetary defense,
          and witness the forces that shaped our world.
        </p>

        {/* Comprehensive Feature Overview */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">Complete Impact Analysis Suite</h3>

          {/* Primary Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 hover:scale-105 transition-transform duration-300 text-center">
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Interactive 3D Earth</h4>
              <p className="text-gray-300 text-sm">Rotate and explore our planet with realistic impact visualizations and population heatmaps</p>
              <div className="mt-4 text-xs text-blue-400 opacity-75">Available in simulator</div>
            </div>

            <button 
              onClick={() => handleFeatureClick('scientific-physics')}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 text-center cursor-pointer hover:bg-white/5"
            >
              <Calculator className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Scientific Physics</h4>
              <p className="text-gray-300 text-sm">Accurate calculations based on NASA data, real asteroid properties, and validated impact models</p>
              <div className="mt-4 text-xs text-green-400 opacity-75">Click to learn more →</div>
            </button>

            <button 
              onClick={() => handleFeatureClick('nasa-data')}
              className="glass-card p-6 hover:scale-105 transition-transform duration-300 text-center cursor-pointer hover:bg-white/5"
            >
              <Satellite className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Live NASA Data</h4>
              <p className="text-gray-300 text-sm">Real-time tracking of Near-Earth Objects with current orbital data and threat assessments</p>
              <div className="mt-4 text-xs text-purple-400 opacity-75">Click to learn more →</div>
            </button>
          </div>

          {/* Advanced Analysis Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button 
              onClick={() => handleFeatureClick('ai-risk')}
              className="glass-card p-4 hover:scale-105 transition-transform duration-300 text-center cursor-pointer hover:bg-white/5"
            >
              <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">AI Risk Analyzer</h5>
              <p className="text-gray-300 text-xs">AI-powered city vulnerability assessment with impact scenarios and emergency recommendations</p>
              <div className="mt-3 text-xs text-cyan-400 opacity-75">Click to learn more →</div>
            </button>

            <button 
              onClick={() => handleFeatureClick('impact-analysis')}
              className="glass-card p-4 hover:scale-105 transition-transform duration-300 text-center cursor-pointer hover:bg-white/5"
            >
              <Target className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">Impact Analysis</h5>
              <p className="text-gray-300 text-xs">Detailed consequence modeling including casualties, infrastructure damage, and economic impact</p>
              <div className="mt-3 text-xs text-red-400 opacity-75">Click to learn more →</div>
            </button>

            <button 
              onClick={() => handleFeatureClick('time-lapse')}
              className="glass-card p-4 hover:scale-105 transition-transform duration-300 text-center cursor-pointer hover:bg-white/5"
            >
              <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">Time-Lapse Simulation</h5>
              <p className="text-gray-300 text-xs">Watch impacts unfold over time from initial contact through long-term aftermath effects</p>
              <div className="mt-3 text-xs text-orange-400 opacity-75">Click to learn more →</div>
            </button>

            <button 
              onClick={() => handleFeatureClick('aftermath')}
              className="glass-card p-4 hover:scale-105 transition-transform duration-300 text-center cursor-pointer hover:bg-white/5"
            >
              <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h5 className="text-lg font-bold text-white mb-2">Aftermath Visualization</h5>
              <p className="text-gray-300 text-xs">Comprehensive post-impact analysis including environmental, geological, and societal effects</p>
              <div className="mt-3 text-xs text-yellow-400 opacity-75">Click to learn more →</div>
            </button>
          </div>

          {/* Key Capabilities */}
          <div className="glass-card p-6">
            <h4 className="text-2xl font-bold text-white mb-6 text-center">What You Can Explore</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Simulate impacts on 20+ major world cities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Adjust asteroid size (10m - 10km) and velocity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Track real Near-Earth Objects from NASA</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300">AI-powered risk assessment and recommendations</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-gray-300">Calculate energy release, crater size, and damage zones</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-gray-300">Visualize population density and vulnerability</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Explore time-lapse impact progression</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span className="text-gray-300">Learn about planetary defense strategies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnterApp}
          className="group relative px-12 py-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl font-bold text-2xl text-white shadow-2xl hover:shadow-red-500/25 hover:scale-110 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center gap-4">
            <span>LAUNCH SIMULATOR</span>
            <Zap className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </button>

        {/* Scroll Indicator */}
        <div className="mt-16 animate-bounce">
          <ArrowDown className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-gray-400 text-sm mt-2">Scroll to explore features</p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Asteroids */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-full animate-pulse opacity-30 animation-delay-3000"></div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-32 max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">Why Meteor Impact Simulation?</h3>
            <div className="space-y-4 text-gray-300">
              <p>
                Asteroid impacts have shaped Earth's history, from creating the Moon to ending the age of dinosaurs. 
                Understanding these cosmic events helps us prepare for future threats and appreciate the forces that continue to shape our planet.
              </p>
              <p>
                Our simulator uses real NASA data and scientific models to provide accurate impact calculations, 
                making complex astrophysics accessible to everyone through stunning visualizations.
              </p>
            </div>
          </div>

          <div className="glass-card p-8">
            <h4 className="text-2xl font-bold text-white mb-6 text-center">Quick Facts</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Daily space debris hitting Earth:</span>
                <span className="text-blue-400 font-mono">~50 tons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Chicxulub impact energy:</span>
                <span className="text-red-400 font-mono">100M Mt TNT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Tracked near-Earth asteroids:</span>
                <span className="text-green-400 font-mono">30,000+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Atmosphere protection limit:</span>
                <span className="text-purple-400 font-mono">~25 meters</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;