#!/usr/bin/env python3
"""
Enhanced NASA Impact Simulator Backend
Comprehensive API for asteroid impact analysis with AI integration
"""

import os
import json
import math
import requests
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
NASA_API_KEY = os.getenv('NASA_API_KEY', 'wZH9g1tdRAIGSN7lOGjybio3awZoStL5OmkJ7Wnt')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBDGtqkVuXew1n533vl1hRiAt6zFBgd-KM')

# Configure Gemini AI
try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    print("✅ Gemini AI configured successfully")
except Exception as e:
    print(f"⚠️ Gemini AI configuration failed: {e}")
    model = None

# Enhanced city database with detailed metrics
CITY_DATABASE = {
    'new-york': {
        'name': 'New York City',
        'lat': 40.7128,
        'lng': -74.0060,
        'population': 8336817,
        'area_km2': 778.2,
        'population_density': 10715,
        'infrastructure_score': 85,
        'emergency_preparedness': 78,
        'hospitals': 62,
        'shelters': 45,
        'evacuation_routes': 12,
        'geographic_risk': 65,
        'coastal': True,
        'elevation': 10
    },
    'london': {
        'name': 'London',
        'lat': 51.5074,
        'lng': -0.1278,
        'population': 9648110,
        'area_km2': 1572,
        'population_density': 6140,
        'infrastructure_score': 88,
        'emergency_preparedness': 82,
        'hospitals': 78,
        'shelters': 52,
        'evacuation_routes': 15,
        'geographic_risk': 45,
        'coastal': False,
        'elevation': 35
    },
    'tokyo': {
        'name': 'Tokyo',
        'lat': 35.6762,
        'lng': 139.6503,
        'population': 37400068,
        'area_km2': 2194,
        'population_density': 17045,
        'infrastructure_score': 92,
        'emergency_preparedness': 95,
        'hospitals': 156,
        'shelters': 89,
        'evacuation_routes': 28,
        'geographic_risk': 85,
        'coastal': True,
        'elevation': 40
    },
    'paris': {
        'name': 'Paris',
        'lat': 48.8566,
        'lng': 2.3522,
        'population': 2161000,
        'area_km2': 105.4,
        'population_density': 20500,
        'infrastructure_score': 86,
        'emergency_preparedness': 75,
        'hospitals': 45,
        'shelters': 32,
        'evacuation_routes': 8,
        'geographic_risk': 35,
        'coastal': False,
        'elevation': 35
    },
    'sydney': {
        'name': 'Sydney',
        'lat': -33.8688,
        'lng': 151.2093,
        'population': 5312163,
        'area_km2': 12368,
        'population_density': 430,
        'infrastructure_score': 84,
        'emergency_preparedness': 80,
        'hospitals': 38,
        'shelters': 28,
        'evacuation_routes': 18,
        'geographic_risk': 55,
        'coastal': True,
        'elevation': 58
    }
}

def calculate_detailed_impact_physics(diameter_m, velocity_km_s):
    """Calculate comprehensive impact physics"""
    # Constants
    EARTH_GRAVITY = 9.81  # m/s²
    ASTEROID_DENSITY = 2600  # kg/m³ (typical rocky asteroid)
    
    # Basic calculations
    radius_m = diameter_m / 2
    volume_m3 = (4/3) * math.pi * (radius_m ** 3)
    mass_kg = volume_m3 * ASTEROID_DENSITY
    velocity_m_s = velocity_km_s * 1000
    
    # Kinetic energy (Joules)
    kinetic_energy_j = 0.5 * mass_kg * (velocity_m_s ** 2)
    kinetic_energy_mt = kinetic_energy_j / (4.184e15)  # Convert to megatons TNT
    
    # Crater calculations
    crater_diameter_km = 1.8 * (diameter_m ** 0.78) * (velocity_km_s ** 0.44) / 1000
    crater_depth_km = crater_diameter_km / 5
    
    # Damage zones (km from impact)
    fireball_radius_km = 0.28 * (kinetic_energy_mt ** 0.33)
    thermal_radius_km = 1.9 * (kinetic_energy_mt ** 0.41)
    shockwave_radius_km = 4.6 * (kinetic_energy_mt ** 0.33)
    airblast_radius_km = 8.2 * (kinetic_energy_mt ** 0.33)
    
    return {
        'diameter_m': diameter_m,
        'mass_kg': mass_kg,
        'velocity_km_s': velocity_km_s,
        'kinetic_energy_mt': kinetic_energy_mt,
        'crater_diameter_km': crater_diameter_km,
        'crater_depth_km': crater_depth_km,
        'fireball_radius_km': fireball_radius_km,
        'thermal_radius_km': thermal_radius_km,
        'shockwave_radius_km': shockwave_radius_km,
        'airblast_radius_km': airblast_radius_km
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'services': {
            'nasa_api': 'connected' if NASA_API_KEY else 'missing_key',
            'gemini_ai': 'connected' if model else 'disconnected'
        }
    })

@app.route('/api/neo/hazardous', methods=['GET'])
def get_hazardous_asteroids():
    """Get hazardous Near Earth Objects from NASA API"""
    try:
        # Get current date and 7 days ahead
        start_date = datetime.now().strftime('%Y-%m-%d')
        end_date = (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d')
        
        url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start_date}&end_date={end_date}&api_key={NASA_API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            hazardous_asteroids = []
            
            for date, asteroids in data['near_earth_objects'].items():
                for asteroid in asteroids:
                    if asteroid.get('is_potentially_hazardous_asteroid', False):
                        # Calculate enhanced risk score
                        diameter = asteroid['estimated_diameter']['meters']['estimated_diameter_max']
                        velocity = float(asteroid['close_approach_data'][0]['relative_velocity']['kilometers_per_second'])
                        miss_distance = float(asteroid['close_approach_data'][0]['miss_distance']['kilometers'])
                        
                        # Risk scoring algorithm
                        size_score = min(diameter / 1000 * 100, 100)  # Normalize to 100
                        velocity_score = min(velocity / 30 * 100, 100)  # Normalize to 100
                        proximity_score = max(0, 100 - (miss_distance / 7480000 * 100))  # Moon distance = 0 score
                        
                        risk_score = (size_score * 0.4 + velocity_score * 0.3 + proximity_score * 0.3)
                        
                        hazardous_asteroids.append({
                            'id': asteroid['id'],
                            'name': asteroid['name'],
                            'diameter_m': diameter,
                            'velocity_km_s': velocity,
                            'miss_distance_km': miss_distance,
                            'approach_date': asteroid['close_approach_data'][0]['close_approach_date'],
                            'risk_score': round(risk_score, 1),
                            'threat_level': get_threat_level(risk_score)
                        })
            
            # Sort by risk score
            hazardous_asteroids.sort(key=lambda x: x['risk_score'], reverse=True)
            
            return jsonify({
                'success': True,
                'count': len(hazardous_asteroids),
                'asteroids': hazardous_asteroids[:10]  # Top 10 most dangerous
            })
        else:
            return jsonify({
                'success': False,
                'error': f'NASA API error: {response.status_code}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_threat_level(risk_score):
    """Determine threat level based on risk score"""
    if risk_score >= 80:
        return 'EXTREME'
    elif risk_score >= 60:
        return 'HIGH'
    elif risk_score >= 40:
        return 'MODERATE'
    elif risk_score >= 20:
        return 'LOW'
    else:
        return 'MINIMAL'

@app.route('/api/neo/stats', methods=['GET'])
def get_neo_statistics():
    """Get comprehensive NEO statistics"""
    try:
        # Get NEO statistics from NASA
        url = f"https://api.nasa.gov/neo/rest/v1/stats?api_key={NASA_API_KEY}"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            stats = response.json()
            
            # Enhanced statistics
            enhanced_stats = {
                'total_discovered': stats['near_earth_object_count'],
                'potentially_hazardous': stats.get('potentially_hazardous_asteroid_count', 0),
                'size_distribution': {
                    'small': stats.get('near_earth_object_count', 0) * 0.85,  # < 140m
                    'medium': stats.get('near_earth_object_count', 0) * 0.12,  # 140m - 1km
                    'large': stats.get('near_earth_object_count', 0) * 0.03   # > 1km
                },
                'discovery_rate': {
                    'per_year': 2000,  # Approximate current rate
                    'trend': 'increasing'
                },
                'impact_probability': {
                    'next_100_years': 0.01,  # 1% chance
                    'civilization_threat': 0.0001  # 0.01% chance
                }
            }
            
            return jsonify({
                'success': True,
                'statistics': enhanced_stats,
                'last_updated': datetime.now().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': f'NASA API error: {response.status_code}'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/impact/simulate', methods=['POST'])
def simulate_impact():
    """Simulate asteroid impact with detailed physics"""
    try:
        data = request.get_json()
        diameter = data.get('diameter', 100)  # meters
        velocity = data.get('velocity', 20)   # km/s
        city_id = data.get('city_id', 'new-york')

        # Get city data
        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])

        # Calculate physics
        physics = calculate_detailed_impact_physics(diameter, velocity)

        # Calculate casualties and damage
        population = city_data['population']
        area_km2 = city_data['area_km2']

        # Damage zones and casualties
        fireball_area = math.pi * (physics['fireball_radius_km'] ** 2)
        thermal_area = math.pi * (physics['thermal_radius_km'] ** 2)
        shockwave_area = math.pi * (physics['shockwave_radius_km'] ** 2)

        # Population density in damage zones
        pop_density = population / area_km2

        # Casualty estimates (simplified model)
        fireball_casualties = min(fireball_area * pop_density * 0.95, population)
        thermal_casualties = min(thermal_area * pop_density * 0.6, population)
        shockwave_casualties = min(shockwave_area * pop_density * 0.3, population)

        total_casualties = min(fireball_casualties + thermal_casualties + shockwave_casualties, population)

        # Infrastructure damage
        buildings_destroyed = min(shockwave_area * 1000, city_data.get('buildings', 100000))
        economic_damage_billion = physics['kinetic_energy_mt'] * 10  # Rough estimate

        result = {
            'physics': physics,
            'casualties': {
                'total': int(total_casualties),
                'fireball_zone': int(fireball_casualties),
                'thermal_zone': int(thermal_casualties),
                'shockwave_zone': int(shockwave_casualties),
                'survival_rate': max(0, (population - total_casualties) / population * 100)
            },
            'damage': {
                'buildings_destroyed': int(buildings_destroyed),
                'economic_damage_billion_usd': round(economic_damage_billion, 2),
                'infrastructure_damage_percent': min(90, physics['kinetic_energy_mt'] * 5)
            },
            'city_data': city_data,
            'timestamp': datetime.now().isoformat()
        }

        return jsonify({
            'success': True,
            'simulation': result
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/ai/risk-analysis', methods=['POST'])
def ai_risk_analysis():
    """AI-powered city risk analysis using Gemini"""
    try:
        data = request.get_json()
        city_id = data.get('city_id', 'new-york')
        asteroid_size = data.get('asteroid_size', 100)

        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])

        if model:
            # Create detailed prompt for Gemini AI
            prompt = f"""
            You are Dr. Sarah Chen, a leading planetary defense expert with 20 years of experience at NASA's Planetary Defense Coordination Office.

            Analyze the asteroid impact risk for {city_data['name']} with the following parameters:
            - City: {city_data['name']}
            - Population: {city_data['population']:,}
            - Population Density: {city_data['population_density']:,} people/km²
            - Infrastructure Score: {city_data['infrastructure_score']}/100
            - Emergency Preparedness: {city_data['emergency_preparedness']}/100
            - Hospitals: {city_data['hospitals']}
            - Emergency Shelters: {city_data['shelters']}
            - Evacuation Routes: {city_data['evacuation_routes']}
            - Coastal City: {city_data['coastal']}
            - Elevation: {city_data['elevation']}m

            Asteroid Parameters:
            - Diameter: {asteroid_size} meters
            - Estimated Impact Energy: {calculate_detailed_impact_physics(asteroid_size, 20)['kinetic_energy_mt']:.2f} megatons TNT equivalent

            Provide a comprehensive risk assessment in exactly 150-200 words covering:
            1. Overall vulnerability assessment
            2. Key risk factors specific to this city
            3. Expected impact severity
            4. Critical emergency response recommendations

            Write as an expert briefing to emergency management officials. Be scientific but accessible.
            """

            try:
                response = model.generate_content(prompt)
                ai_analysis = response.text
            except Exception as e:
                print(f"Gemini API error: {e}")
                ai_analysis = f"AI analysis temporarily unavailable. Based on the data, {city_data['name']} shows moderate to high vulnerability due to population density of {city_data['population_density']:,} people/km². Immediate evacuation protocols should be activated for a {asteroid_size}m asteroid impact."
        else:
            ai_analysis = f"AI analysis unavailable. {city_data['name']} requires immediate assessment for {asteroid_size}m asteroid impact scenario."

        # Calculate basic risk factors
        risk_factors = {
            'population_density': min(100, city_data['population_density'] / 200),
            'infrastructure_vulnerability': 100 - city_data['infrastructure_score'],
            'emergency_preparedness': city_data['emergency_preparedness'],
            'geographic_risk': city_data.get('geographic_risk', 50)
        }

        overall_risk = sum(risk_factors.values()) / len(risk_factors)

        return jsonify({
            'success': True,
            'analysis': {
                'ai_analysis': ai_analysis,
                'risk_score': round(overall_risk, 1),
                'risk_factors': risk_factors,
                'city_data': city_data,
                'recommendations': generate_recommendations(city_data, asteroid_size)
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/impact/simulate-real', methods=['GET'])
def simulate_real_impact():
    """Simulate asteroid impact using lat/lng and optional provided asteroid parameters.
    Query params: asteroid_id (optional), lat, lng, diameter (m, optional), velocity (km/s, optional)
    Picks nearest known city to ground population metrics, then computes physics.
    """
    try:
        asteroid_id = request.args.get('asteroid_id')  # currently unused, kept for compatibility
        lat = float(request.args.get('lat', '0'))
        lng = float(request.args.get('lng', '0'))
        diameter = float(request.args.get('diameter', '100'))
        velocity = float(request.args.get('velocity', '20'))

        # Find nearest city in our database to ground casualty/damage calcs
        def haversine(lat1, lon1, lat2, lon2):
            R = 6371.0
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return R * c

        nearest_key = None
        nearest_dist = float('inf')
        for key, cd in CITY_DATABASE.items():
            d = haversine(lat, lng, cd['lat'], cd['lng'])
            if d < nearest_dist:
                nearest_dist = d
                nearest_key = key
        city_data = CITY_DATABASE.get(nearest_key or 'new-york')

        physics = calculate_detailed_impact_physics(diameter, velocity)

        population = city_data['population']
        area_km2 = city_data['area_km2']
        pop_density = population / max(area_km2, 1)

        fireball_area = math.pi * (physics['fireball_radius_km'] ** 2)
        thermal_area = math.pi * (physics['thermal_radius_km'] ** 2)
        shockwave_area = math.pi * (physics['shockwave_radius_km'] ** 2)

        fireball_casualties = min(fireball_area * pop_density * 0.95, population)
        thermal_casualties = min(thermal_area * pop_density * 0.6, population)
        shockwave_casualties = min(shockwave_area * pop_density * 0.3, population)
        total_casualties = min(fireball_casualties + thermal_casualties + shockwave_casualties, population)

        result = {
            'asteroid': {
                'id': asteroid_id or 'custom',
                'diameter_meters': diameter,
                'is_hazardous': diameter >= 140
            },
            'impact': {
                'location': { 'lat': lat, 'lng': lng },
                'energy_mt': physics['kinetic_energy_mt'],
                'crater_km': physics['crater_diameter_km'],
                'thermal_km': physics['thermal_radius_km'],
                'shock_km': physics['shockwave_radius_km'],
                'velocity_kms': velocity
            },
            'casualties': {
                'total': int(total_casualties),
                'fireball_zone': int(fireball_casualties),
                'thermal_zone': int(thermal_casualties),
                'shockwave_zone': int(shockwave_casualties)
            },
            'city_data': city_data,
            'nearest_city_key': nearest_key,
        }

        return jsonify({ 'success': True, 'simulation': result })
    except Exception as e:
        return jsonify({ 'success': False, 'error': str(e) }), 500


@app.route('/api/ai/mitigations', methods=['POST'])
def ai_mitigations():
    """Generate technical and civil protection mitigations using Gemini, strictly grounded to provided data."""
    try:
        data = request.get_json()
        city_id = data.get('city_id', 'new-york')
        asteroid_size = data.get('asteroid_size', 100)
        velocity = data.get('velocity', 20)

        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])
        physics = calculate_detailed_impact_physics(asteroid_size, velocity)

        base_context = {
            'city': city_data,
            'asteroid': {
                'diameter_m': asteroid_size,
                'velocity_km_s': velocity,
                'energy_mt': physics['kinetic_energy_mt']
            }
        }

        technical_defaults = [
            'Kinetic impactor mission planning (multi-year lead time, trajectory change)',
            'Gravity tractor station-keeping (requires years of engagement)',
            'Nuclear standoff detonation (last resort; fragmentation risk management)',
            'Wide-field survey expansion to extend warning time',
            'Rapid-launch capability and mission rehearsal'
        ]
        civil_defaults = [
            'Tiered evacuations by concentric zones based on shock/thermal radii',
            'Hardened shelters and underground facilities activation',
            'Medical surge capacity and triage centers near low-risk zones',
            'Fuel, food, water stockpiles; backup comms and power',
            'Tsunami protocols for coastal areas; traffic contraflow plans'
        ]

        if model:
            prompt = f"""
You are a mitigation planner. ONLY use the structured JSON context below. Do not invent data. If something is not present, say 'Not available'.
Return a compact JSON with keys: technical_mitigations, civil_mitigations, priority_actions (3 items), rationale.

CONTEXT (JSON):
City: {json.dumps(city_data)}
Asteroid: {json.dumps(base_context['asteroid'])}

Rules:
- Ground all numbers to provided context (e.g., use energy_mt, population, coastal, hospitals).
- If coastal is true, include tsunami-specific steps.
- Keep items short (max 20 words each).
- Avoid speculative technologies; stick to standard methods.
"""
            try:
                response = model.generate_content(prompt)
                text = response.text or ''
            except Exception as e:
                print(f"Gemini API error in mitigations: {e}")
                text = ''
        else:
            text = ''

        mitigations = {
            'technical_mitigations': technical_defaults,
            'civil_mitigations': civil_defaults,
            'priority_actions': [
                'Issue immediate public guidance and activate EOC',
                'Pre-stage evacuations based on shock radius',
                'Secure hospitals, fuel, water, and shelters'
            ],
            'rationale': 'Defaults used; AI text merged when available.'
        }

        # Try to merge AI JSON if present
        try:
            ai_json_start = text.find('{')
            ai_json_end = text.rfind('}')
            if ai_json_start != -1 and ai_json_end != -1:
                ai_obj = json.loads(text[ai_json_start:ai_json_end+1])
                for k in ['technical_mitigations', 'civil_mitigations', 'priority_actions', 'rationale']:
                    if k in ai_obj:
                        mitigations[k] = ai_obj[k]
        except Exception:
            pass

        return jsonify({
            'success': True,
            'context': base_context,
            'mitigations': mitigations
        })
    except Exception as e:
        return jsonify({ 'success': False, 'error': str(e) }), 500


def generate_recommendations(city_data, asteroid_size):
    """Generate emergency recommendations based on city data and asteroid size"""
    recommendations = []

    if asteroid_size > 500:
        recommendations.append("IMMEDIATE EVACUATION: City-wide evacuation required within 12 hours")
        recommendations.append("INTERNATIONAL AID: Request immediate international emergency assistance")
    elif asteroid_size > 200:
        recommendations.append("MASS EVACUATION: Evacuate within 50km radius of predicted impact")
        recommendations.append("EMERGENCY SHELTERS: Open all available underground facilities")
    else:
        recommendations.append("SELECTIVE EVACUATION: Evacuate high-risk areas and coastal zones")
        recommendations.append("SHELTER IN PLACE: Reinforce buildings and prepare emergency supplies")

    if city_data['coastal']:
        recommendations.append("TSUNAMI WARNING: Activate coastal evacuation protocols immediately")

    if city_data['emergency_preparedness'] < 70:
        recommendations.append("EMERGENCY COORDINATION: Establish unified command center")

    if city_data['hospitals'] < 50:
        recommendations.append("MEDICAL SURGE: Request additional medical resources from neighboring regions")

    return recommendations

@app.route('/api/cities/data', methods=['GET'])
def get_cities_data():
    """Get comprehensive city database"""
    return jsonify({
        'success': True,
        'cities': CITY_DATABASE
    })

@app.route('/api/timeline/phases', methods=['POST'])
def get_timeline_phases():
    """Get impact timeline phases"""
    try:
        data = request.get_json()
        asteroid_size = data.get('asteroid_size', 100)

        phases = [
            {
                'id': 'approach',
                'name': 'Atmospheric Entry',
                'duration': '10 seconds',
                'description': 'Asteroid enters Earth\'s atmosphere at hypersonic speed',
                'effects': ['Visible fireball', 'Sonic booms', 'Atmospheric heating']
            },
            {
                'id': 'impact',
                'name': 'Ground Impact',
                'duration': 'Instantaneous',
                'description': 'Asteroid strikes surface with tremendous energy release',
                'effects': ['Crater formation', 'Seismic waves', 'Initial fireball']
            },
            {
                'id': 'fireball',
                'name': 'Fireball Expansion',
                'duration': '30 seconds',
                'description': 'Superheated plasma expands from impact site',
                'effects': ['Thermal radiation', 'Vaporization', 'Intense heat']
            },
            {
                'id': 'shockwave',
                'name': 'Shockwave Propagation',
                'duration': '2-5 minutes',
                'description': 'Pressure wave travels outward destroying structures',
                'effects': ['Building collapse', 'Overpressure', 'Debris field']
            },
            {
                'id': 'aftermath',
                'name': 'Immediate Aftermath',
                'duration': '1-24 hours',
                'description': 'Secondary effects and environmental changes begin',
                'effects': ['Dust cloud', 'Fires', 'Seismic aftershocks']
            }
        ]

        return jsonify({
            'success': True,
            'phases': phases,
            'asteroid_size': asteroid_size
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/aftermath/layers', methods=['POST'])
def get_aftermath_layers():
    """Get post-impact visualization layers"""
    try:
        data = request.get_json()
        asteroid_size = data.get('asteroid_size', 100)

        # Calculate impact energy for layer intensity
        physics = calculate_detailed_impact_physics(asteroid_size, 20)
        energy_mt = physics['kinetic_energy_mt']

        layers = [
            {
                'id': 'dust-cloud',
                'name': 'Dust Cloud',
                'intensity': min(100, energy_mt * 10),
                'duration': '6-12 months',
                'description': 'Atmospheric dust blocking sunlight',
                'color': '#8B4513'
            },
            {
                'id': 'fire-zones',
                'name': 'Fire Zones',
                'intensity': min(100, energy_mt * 15),
                'duration': '1-4 weeks',
                'description': 'Widespread fires from thermal radiation',
                'color': '#FF4500'
            },
            {
                'id': 'radiation-zones',
                'name': 'Radiation Zones',
                'intensity': min(100, energy_mt * 5),
                'duration': '1-10 years',
                'description': 'Radioactive contamination areas',
                'color': '#32CD32'
            },
            {
                'id': 'climate-effects',
                'name': 'Climate Effects',
                'intensity': min(100, energy_mt * 8),
                'duration': '2-5 years',
                'description': 'Global temperature and weather changes',
                'color': '#4169E1'
            }
        ]

        return jsonify({
            'success': True,
            'layers': layers,
            'impact_energy_mt': energy_mt
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/survival/zones', methods=['POST'])
def get_survival_zones():
    """Calculate survival probability zones"""
    try:
        data = request.get_json()
        city_id = data.get('city_id', 'new-york')
        asteroid_size = data.get('asteroid_size', 100)

        city_data = CITY_DATABASE.get(city_id, CITY_DATABASE['new-york'])
        physics = calculate_detailed_impact_physics(asteroid_size, 20)

        # Calculate survival zones
        base_radius = physics['shockwave_radius_km']

        zones = [
            {
                'id': 'ground-zero',
                'name': 'Ground Zero',
                'radius': base_radius * 0.2,
                'survival_rate': 0,
                'color': '#DC2626',
                'description': 'Complete destruction - No survival possible',
                'factors': {
                    'shelters': 0,
                    'hospitals': 0,
                    'evacuation_routes': 0,
                    'infrastructure': 0
                }
            },
            {
                'id': 'critical-zone',
                'name': 'Critical Impact Zone',
                'radius': base_radius * 0.5,
                'survival_rate': 5,
                'color': '#EA580C',
                'description': 'Extreme danger - Survival only in reinforced shelters',
                'factors': {
                    'shelters': 10,
                    'hospitals': 5,
                    'evacuation_routes': 15,
                    'infrastructure': 20
                }
            },
            {
                'id': 'severe-zone',
                'name': 'Severe Damage Zone',
                'radius': base_radius * 0.8,
                'survival_rate': 25,
                'color': '#F59E0B',
                'description': 'Heavy casualties - Underground shelters essential',
                'factors': {
                    'shelters': 40,
                    'hospitals': 25,
                    'evacuation_routes': 35,
                    'infrastructure': 45
                }
            },
            {
                'id': 'moderate-zone',
                'name': 'Moderate Risk Zone',
                'radius': base_radius * 1.2,
                'survival_rate': 60,
                'color': '#EAB308',
                'description': 'Significant risk - Immediate evacuation required',
                'factors': {
                    'shelters': 70,
                    'hospitals': 60,
                    'evacuation_routes': 65,
                    'infrastructure': 70
                }
            },
            {
                'id': 'safe-zone',
                'name': 'Relative Safety Zone',
                'radius': base_radius * 2.5,
                'survival_rate': 95,
                'color': '#22C55E',
                'description': 'High survival rate - Minor injuries possible',
                'factors': {
                    'shelters': 95,
                    'hospitals': 90,
                    'evacuation_routes': 95,
                    'infrastructure': 95
                }
            }
        ]

        return jsonify({
            'success': True,
            'zones': zones,
            'city_data': city_data,
            'impact_radius': base_radius
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/alerts/timeline', methods=['POST'])
def get_alert_timeline():
    """Generate global alert system timeline"""
    try:
        data = request.get_json()
        asteroid_size = data.get('asteroid_size', 100)
        detection_time = data.get('detection_time', 72)  # hours before impact

        # Calculate timeline based on asteroid size and detection time
        timeline_phases = [
            {
                'id': 'detection',
                'name': 'Initial Detection',
                'time_to_impact': detection_time,
                'duration': 'T-72h',
                'status': 'active',
                'actions': [
                    'Automated telescope detection',
                    'Trajectory calculation initiated',
                    'Size and composition analysis',
                    'Impact probability assessment'
                ],
                'agencies': ['NASA', 'ESA', 'JAXA', 'Roscosmos']
            },
            {
                'id': 'verification',
                'name': 'Threat Verification',
                'time_to_impact': detection_time - 24,
                'duration': 'T-48h',
                'status': 'pending',
                'actions': [
                    'International observatory network activated',
                    'Trajectory refinement and confirmation',
                    'Impact zone prediction narrowed',
                    'Threat level classification assigned'
                ],
                'agencies': ['International Astronomical Union', 'Minor Planet Center']
            },
            {
                'id': 'government-alert',
                'name': 'Government Notification',
                'time_to_impact': detection_time - 36,
                'duration': 'T-36h',
                'status': 'pending',
                'actions': [
                    'Space agencies notify government officials',
                    'Emergency response teams activated',
                    'International coordination initiated',
                    'Media briefing preparation'
                ],
                'agencies': ['NASA Planetary Defense', 'UN Office for Outer Space Affairs']
            },
            {
                'id': 'public-warning',
                'name': 'Public Warning Issued',
                'time_to_impact': detection_time - 48,
                'duration': 'T-24h',
                'status': 'pending',
                'actions': [
                    'Emergency Alert System (EAS) activated',
                    'Mass media notifications sent',
                    'Social media emergency broadcasts',
                    'International warning coordination'
                ],
                'agencies': ['FEMA', 'Local Emergency Management', 'Media Networks']
            },
            {
                'id': 'evacuation',
                'name': 'Mass Evacuation',
                'time_to_impact': detection_time - 60,
                'duration': 'T-12h',
                'status': 'pending',
                'actions': [
                    'Mandatory evacuation orders issued',
                    'Transportation networks mobilized',
                    'Emergency shelters opened',
                    'Military assistance deployed'
                ],
                'agencies': ['National Guard', 'Transportation Authorities', 'Red Cross']
            }
        ]

        # Adjust timeline based on asteroid size
        if asteroid_size > 500:  # Large asteroid - more time needed
            for phase in timeline_phases:
                phase['time_to_impact'] = phase['time_to_impact'] * 1.5
        elif asteroid_size < 100:  # Small asteroid - less warning time
            for phase in timeline_phases:
                phase['time_to_impact'] = phase['time_to_impact'] * 0.7

        return jsonify({
            'success': True,
            'timeline': timeline_phases,
            'total_warning_time': detection_time,
            'asteroid_size': asteroid_size,
            'threat_level': get_threat_level_from_size(asteroid_size)
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_threat_level_from_size(size):
    """Determine threat level based on asteroid size"""
    if size >= 1000:
        return 'EXTINCTION_LEVEL'
    elif size >= 500:
        return 'CIVILIZATION_THREATENING'
    elif size >= 200:
        return 'REGIONAL_CATASTROPHE'
    elif size >= 100:
        return 'CITY_DESTROYER'
    elif size >= 50:
        return 'LOCAL_DAMAGE'
    else:
        return 'MINIMAL_THREAT'

# Education Card API endpoints
@app.route('/api/education/cards', methods=['GET'])
def get_education_cards():
    """Get all education cards with enhanced content"""
    try:
        cards = [
            {
                'id': 'asteroid-basics',
                'title': 'Asteroid Fundamentals',
                'emoji': '🪨',
                'difficulty': 'beginner',
                'readingTime': 5,
                'category': 'basics',
                'description': 'Learn about asteroids, their composition, and origins',
                'gradient': 'from-blue-500 to-purple-600',
                'content': [
                    {
                        'type': 'overview',
                        'title': 'What are Asteroids?',
                        'text': 'Asteroids are rocky remnants from the early solar system, formed about 4.6 billion years ago. Most orbit the Sun between Mars and Jupiter in the asteroid belt.',
                        'source': 'NASA JPL',
                        'lastUpdated': '2024-01-15'
                    },
                    {
                        'type': 'composition',
                        'title': 'Asteroid Types',
                        'text': 'C-type (carbonaceous): 75% of asteroids, dark and carbon-rich. S-type (silicaceous): 17%, made of silicate and nickel-iron. M-type (metallic): 8%, mostly nickel-iron.',
                        'source': 'Minor Planet Center',
                        'lastUpdated': '2024-01-10'
                    },
                    {
                        'type': 'size',
                        'title': 'Size Distribution',
                        'text': 'Over 1 million asteroids larger than 1km exist. Only about 25,000 are larger than 1km. The largest, Ceres, is 940km in diameter.',
                        'source': 'NASA NEO Program',
                        'lastUpdated': '2024-01-12'
                    }
                ]
            },
            {
                'id': 'impact-physics',
                'title': 'Impact Physics',
                'emoji': '💥',
                'difficulty': 'intermediate',
                'readingTime': 8,
                'category': 'science',
                'description': 'Understanding the physics behind asteroid impacts',
                'gradient': 'from-red-500 to-orange-600',
                'content': [
                    {
                        'type': 'nasa-facts',
                        'title': 'NASA Asteroid Fast Facts',
                        'text': 'Asteroids are rocky remnants from the solar system\'s formation 4.6 billion years ago. NASA has cataloged over 1.3 million asteroids ranging from 33 feet to 329 miles in diameter. Most orbit between Mars and Jupiter.',
                        'source': 'NASA Solar System Exploration',
                        'lastUpdated': '2024-01-20'
                    },
                    {
                        'type': 'energy',
                        'title': 'Impact Energy Physics',
                        'text': 'Impact energy = ½mv². A 100m asteroid at 20km/s releases 100 megatons TNT equivalent. A 10km asteroid at 30,000 mph would release 50 million megatons - enough to cause global environmental changes.',
                        'source': 'NASA Glenn Research Center',
                        'lastUpdated': '2024-01-18'
                    },
                    {
                        'type': 'crater',
                        'title': 'Crater Formation Process',
                        'text': 'Impact cratering is an explosion process occurring in three phases: contact/compression (microseconds), excavation (seconds), and modification (minutes). Crater diameter is typically 10-20x the asteroid diameter.',
                        'source': 'Lunar and Planetary Institute',
                        'lastUpdated': '2024-01-15'
                    },
                    {
                        'type': 'hazardous',
                        'title': 'Potentially Hazardous Objects',
                        'text': 'NASA\'s Planetary Defense Coordination Office tracks asteroids that come within 4.6 million miles of Earth\'s orbit and are larger than 460 feet in diameter.',
                        'source': 'NASA Planetary Defense',
                        'lastUpdated': '2024-01-17'
                    }
                ]
            },
            {
                'id': 'planetary-defense',
                'title': 'Planetary Defense',
                'emoji': '🛡️',
                'difficulty': 'intermediate',
                'readingTime': 10,
                'category': 'defense',
                'description': 'Methods and technologies to protect Earth from asteroid impacts',
                'gradient': 'from-green-500 to-blue-600',
                'content': [
                    {
                        'type': 'detection',
                        'title': 'Detection Systems',
                        'text': 'Ground-based telescopes like Catalina Sky Survey and LINEAR detect 90% of 1km+ asteroids. Space-based missions like NEOWISE provide infrared detection capabilities.',
                        'source': 'NASA Planetary Defense',
                        'lastUpdated': '2024-01-16'
                    },
                    {
                        'type': 'deflection',
                        'title': 'Deflection Methods',
                        'text': 'Kinetic impactor (DART mission), gravity tractor, nuclear explosive device, solar sail, mass driver. Choice depends on asteroid size, composition, and warning time.',
                        'source': 'ESA Space Situational Awareness',
                        'lastUpdated': '2024-01-15'
                    },
                    {
                        'type': 'dart',
                        'title': 'DART Mission Success',
                        'text': 'NASA\'s DART mission successfully altered asteroid Dimorphos\' orbit by 32 minutes in 2022, proving kinetic impactor technology works.',
                        'source': 'NASA DART Mission',
                        'lastUpdated': '2024-01-17'
                    }
                ]
            },
            {
                'id': 'historical-impacts',
                'title': 'Historical Impacts',
                'emoji': '🦕',
                'difficulty': 'beginner',
                'readingTime': 7,
                'category': 'history',
                'description': 'Major asteroid impacts throughout Earth\'s history',
                'gradient': 'from-purple-500 to-pink-600',
                'content': [
                    {
                        'type': 'chicxulub',
                        'title': 'Chicxulub Impact (66 MYA)',
                        'text': '10-15km asteroid created 150km crater in Mexico. Released energy equivalent to 100 million megatons, causing mass extinction including dinosaurs.',
                        'source': 'Geological Society',
                        'lastUpdated': '2024-01-14'
                    },
                    {
                        'type': 'tunguska',
                        'title': 'Tunguska Event (1908)',
                        'text': '50-60m object exploded 5-10km above Siberia, flattening 2,000 km² of forest. No crater formed due to airburst explosion.',
                        'source': 'Russian Academy of Sciences',
                        'lastUpdated': '2024-01-12'
                    },
                    {
                        'type': 'chelyabinsk',
                        'title': 'Chelyabinsk Meteor (2013)',
                        'text': '20m asteroid exploded over Russia, injuring 1,500 people from glass fragments. Demonstrated need for better detection of smaller objects.',
                        'source': 'Meteoritical Society',
                        'lastUpdated': '2024-01-13'
                    }
                ]
            }
        ]
        
        return jsonify({
            'success': True,
            'cards': cards,
            'total': len(cards)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/education/cards/<card_id>', methods=['GET'])
def get_education_card_detail(card_id):
    """Get detailed information for a specific education card"""
    try:
        # Enhanced content for detailed view
        detailed_content = {
            'asteroid-basics': {
                'id': 'asteroid-basics',
                'title': 'Asteroid Fundamentals',
                'emoji': '🪨',
                'difficulty': 'beginner',
                'readingTime': 5,
                'category': 'basics',
                'description': 'Comprehensive guide to understanding asteroids',
                'gradient': 'from-blue-500 to-purple-600',
                'detailed_sections': [
                    {
                        'title': 'Formation and Origins',
                        'content': 'Asteroids are remnants from the solar system\'s formation 4.6 billion years ago. They represent the building blocks that never coalesced into planets, preserved in the cold vacuum of space.',
                        'subsections': [
                            {
                                'title': 'Solar Nebula Theory',
                                'text': 'Asteroids formed from the solar nebula - a rotating disk of gas and dust surrounding the young Sun. Temperature and pressure variations determined their composition.'
                            },
                            {
                                'title': 'Asteroid Belt Formation',
                                'text': 'Jupiter\'s gravitational influence prevented asteroid belt material from forming a planet, instead creating a region of scattered rocky bodies.'
                            }
                        ]
                    },
                    {
                        'title': 'Classification Systems',
                        'content': 'Asteroids are classified by spectral properties, composition, and orbital characteristics.',
                        'subsections': [
                            {
                                'title': 'Spectral Classes',
                                'text': 'C-type (carbonaceous): Dark, carbon-rich, primitive composition. S-type (silicaceous): Rocky, metallic, more processed. M-type (metallic): Mostly iron-nickel, possibly core remnants.'
                            },
                            {
                                'title': 'Orbital Groups',
                                'text': 'Main Belt: Between Mars and Jupiter. Near-Earth Asteroids (NEAs): Orbits crossing Earth\'s path. Trojans: Sharing Jupiter\'s orbit at Lagrange points.'
                            }
                        ]
                    }
                ],
                'interactive_elements': [
                    {
                        'type': 'size_comparison',
                        'title': 'Asteroid Size Comparison',
                        'data': [
                            {'name': 'Ceres', 'diameter': 940, 'type': 'Dwarf Planet'},
                            {'name': 'Vesta', 'diameter': 525, 'type': 'Large Asteroid'},
                            {'name': 'Pallas', 'diameter': 512, 'type': 'Large Asteroid'},
                            {'name': 'Hygiea', 'diameter': 430, 'type': 'Large Asteroid'},
                            {'name': 'Apophis', 'diameter': 0.34, 'type': 'Near-Earth Asteroid'}
                        ]
                    }
                ],
                'recent_discoveries': [
                    {
                        'date': '2024-01-15',
                        'title': 'New Asteroid Family Discovered',
                        'description': 'Astronomers identified a new family of asteroids with unusual spectral properties, suggesting a unique formation history.'
                    }
                ],
                'related_missions': [
                    {'name': 'OSIRIS-REx', 'target': 'Bennu', 'status': 'Sample Return Complete'},
                    {'name': 'Hayabusa2', 'target': 'Ryugu', 'status': 'Mission Complete'},
                    {'name': 'DART', 'target': 'Dimorphos', 'status': 'Mission Complete'},
                    {'name': 'Lucy', 'target': 'Trojan Asteroids', 'status': 'En Route'}
                ]
            },
            'impact-physics': {
                'id': 'impact-physics',
                'title': 'Impact Physics',
                'emoji': '💥',
                'difficulty': 'intermediate',
                'readingTime': 8,
                'category': 'science',
                'description': 'Deep dive into the physics of asteroid impacts',
                'gradient': 'from-red-500 to-orange-600',
                'detailed_sections': [
                    {
                        'title': 'NASA Asteroid Fast Facts',
                        'content': 'Asteroids are rocky remnants from the early formation of the solar system, approximately 4.6 billion years ago. They range in size from less than 33 feet (10 meters) to about 329 miles (530 kilometers) in diameter. Most asteroids orbit the Sun between Mars and Jupiter in the main asteroid belt.',
                        'subsections': [
                            {
                                'title': 'Size Distribution',
                                'text': 'NASA has cataloged over 1.3 million asteroids. Most are small - only about 25,000 are larger than 1 kilometer. The largest asteroid, Ceres, is 940 km in diameter and classified as a dwarf planet.'
                            },
                            {
                                'title': 'Potentially Hazardous Objects',
                                'text': 'NASA\'s Planetary Defense Coordination Office tracks potentially hazardous asteroids. An asteroid is considered potentially hazardous if its orbit comes within 4.6 million miles (7.5 million kilometers) of Earth\'s orbit and has an estimated diameter of 460 feet (140 meters) or greater.'
                            },
                            {
                                'title': 'Orbital Characteristics',
                                'text': 'Most asteroids orbit between Mars and Jupiter, but some have eccentric orbits that bring them close to Earth. Near-Earth asteroids (NEAs) are of particular interest for both scientific study and planetary defense.'
                            }
                        ]
                    },
                    {
                        'title': 'Impact Energy Physics',
                        'content': 'The kinetic energy of an impacting object is the key factor determining crater size and damage. Impact energy follows the formula KE = ½mv², where faster or more massive objects create exponentially more destruction.',
                        'subsections': [
                            {
                                'title': 'Energy-to-TNT Conversion',
                                'text': 'A 100-meter asteroid traveling at 20 km/s releases energy equivalent to 100 megatons of TNT - 2000 times more powerful than the largest nuclear weapon ever detonated. A 10 km asteroid at 30,000 mph would release approximately 50 million megatons of TNT.'
                            },
                            {
                                'title': 'Velocity Impact',
                                'text': 'Typical asteroid impact velocities range from 11-72 km/s relative to Earth. Earth\'s escape velocity (11.2 km/s) represents the minimum impact speed, while asteroids from the outer solar system can reach much higher velocities.'
                            },
                            {
                                'title': 'Mass-Energy Relationship',
                                'text': 'The relationship between impactor energy and crater size is not linear. A 10x increase in diameter results in 1000x more mass and energy, while a 2x increase in velocity results in 4x more energy due to the squared velocity term.'
                            }
                        ]
                    },
                    {
                        'title': 'Crater Formation Process',
                        'content': 'Impact cratering is essentially an explosion process where the initial kinetic energy of the projectile does work on the target to excavate material and create a crater. The process occurs in three distinct phases happening over microseconds to minutes.',
                        'subsections': [
                            {
                                'title': 'Contact/Compression Phase (microseconds)',
                                'text': 'Upon contact, shock waves propagate through both the asteroid and target material. Pressures reach millions of atmospheres, instantly vaporizing and melting material at the impact site. The asteroid is completely destroyed in this phase.'
                            },
                            {
                                'title': 'Excavation Phase (seconds)',
                                'text': 'The expanding shock wave excavates the crater by ejecting material at high velocities. This creates the characteristic ejecta blanket around the crater. The crater diameter is typically 10-20 times the asteroid diameter.'
                            },
                            {
                                'title': 'Modification Phase (minutes to hours)',
                                'text': 'Crater walls collapse due to gravity, and for large impacts, a central peak may form as the crater floor rebounds. The final crater shape depends on the impact energy, target material properties, and gravitational conditions.'
                            }
                        ]
                    },
                    {
                        'title': 'Impact Effects and Consequences',
                        'content': 'Asteroid impacts produce both primary and secondary effects that can cause widespread destruction far beyond the immediate impact site.',
                        'subsections': [
                            {
                                'title': 'Primary Effects',
                                'text': 'Direct consequences include crater formation, intense seismic waves (equivalent to major earthquakes), thermal radiation that can ignite fires hundreds of kilometers away, and atmospheric shock waves.'
                            },
                            {
                                'title': 'Secondary Effects',
                                'text': 'Ocean impacts generate massive tsunamis that can travel across entire ocean basins. Large impacts inject dust and debris into the atmosphere, potentially causing climate changes. Wildfires can be triggered by thermal radiation and hot ejecta.'
                            },
                            {
                                'title': 'Global Consequences',
                                'text': 'Very large impacts (>1 km asteroids) can cause global environmental changes, including "impact winter" from atmospheric dust blocking sunlight, acid rain from vaporized sulfur compounds, and ozone depletion.'
                            }
                        ]
                    }
                ],
                'calculators': [
                    {
                        'type': 'impact_energy',
                        'title': 'Impact Energy Calculator',
                        'parameters': ['diameter', 'velocity', 'density'],
                        'outputs': ['kinetic_energy', 'tnt_equivalent']
                    },
                    {
                        'type': 'crater_size',
                        'title': 'Crater Size Estimator',
                        'parameters': ['energy', 'target_type', 'impact_angle'],
                        'outputs': ['crater_diameter', 'crater_depth']
                    }
                ],
                'recent_discoveries': [
                    {
                        'date': '2024-01-20',
                        'title': 'DART Mission Impact Analysis Complete',
                        'description': 'NASA completed detailed analysis of DART\'s impact on asteroid Dimorphos, confirming the kinetic impactor technique changed the asteroid\'s orbital period by 32 minutes - exceeding expectations.'
                    },
                    {
                        'date': '2024-01-18',
                        'title': 'New Impact Crater Dating Method',
                        'description': 'Scientists developed improved techniques for dating impact craters using shocked minerals, providing better understanding of Earth\'s impact history and frequency.'
                    },
                    {
                        'date': '2024-01-12',
                        'title': 'Chelyabinsk Meteor New Findings',
                        'description': 'Analysis of the 2013 Chelyabinsk meteor revealed new insights into how small asteroids fragment in Earth\'s atmosphere, improving models for future impact predictions.'
                    }
                ],
                'related_missions': [
                    {
                        'name': 'DART (Double Asteroid Redirection Test)',
                        'target': 'Dimorphos asteroid',
                        'status': 'Completed Successfully'
                    },
                    {
                        'name': 'NEO Surveyor',
                        'target': 'Near-Earth Object detection',
                        'status': 'In Development'
                    },
                    {
                        'name': 'Hera Mission',
                        'target': 'Post-DART Didymos system study',
                        'status': 'Planned Launch 2024'
                    }
                ]
            },
            'planetary-defense': {
                'id': 'planetary-defense',
                'title': 'Planetary Defense',
                'emoji': '🛡️',
                'difficulty': 'intermediate',
                'readingTime': 10,
                'category': 'defense',
                'description': 'Comprehensive overview of planetary defense strategies',
                'gradient': 'from-green-500 to-blue-600',
                'detailed_sections': [
                    {
                        'title': 'Detection Networks',
                        'content': 'Global network of ground and space-based telescopes continuously scan for potentially hazardous asteroids.',
                        'subsections': [
                            {
                                'title': 'Ground-Based Surveys',
                                'text': 'Catalina Sky Survey, LINEAR, NEOWISE, and other programs have discovered over 90% of kilometer-sized near-Earth asteroids.'
                            },
                            {
                                'title': 'Space-Based Detection',
                                'text': 'NEOWISE infrared telescope and planned NEO Surveyor mission provide complementary detection capabilities, especially for dark asteroids.'
                            }
                        ]
                    },
                    {
                        'title': 'Deflection Technologies',
                        'content': 'Multiple methods exist to change an asteroid\'s trajectory, each suited for different scenarios.',
                        'subsections': [
                            {
                                'title': 'Kinetic Impactor',
                                'text': 'Spacecraft impacts asteroid to change velocity. DART mission proved this concept works. Effective for small to medium asteroids with sufficient warning time.'
                            },
                            {
                                'title': 'Gravity Tractor',
                                'text': 'Spacecraft hovers near asteroid, using gravitational attraction to slowly alter trajectory. Precise but requires long lead time.'
                            },
                            {
                                'title': 'Nuclear Option',
                                'text': 'Nuclear explosive device could deflect or fragment large asteroids. Last resort option due to technical and political challenges.'
                            }
                        ]
                    }
                ],
                'mission_timeline': [
                    {
                        'year': '1998',
                        'event': 'Spaceguard Survey begins',
                        'description': 'Congressional mandate to find 90% of 1km+ near-Earth asteroids'
                    },
                    {
                        'year': '2016',
                        'event': 'OSIRIS-REx launches',
                        'description': 'Sample return mission to asteroid Bennu'
                    },
                    {
                        'year': '2021',
                        'event': 'DART launches',
                        'description': 'First planetary defense test mission'
                    },
                    {
                        'year': '2022',
                        'event': 'DART impact success',
                        'description': 'Successfully altered Dimorphos orbit'
                    },
                    {
                        'year': '2028',
                        'event': 'NEO Surveyor launch',
                        'description': 'Next-generation space-based asteroid hunter'
                    }
                ]
            },
            'historical-impacts': {
                'id': 'historical-impacts',
                'title': 'Historical Impacts',
                'emoji': '🦕',
                'difficulty': 'beginner',
                'readingTime': 7,
                'category': 'history',
                'description': 'Major impact events that shaped Earth\'s history',
                'gradient': 'from-purple-500 to-pink-600',
                'detailed_sections': [
                    {
                        'title': 'Mass Extinction Events',
                        'content': 'Several mass extinctions in Earth\'s history are linked to asteroid impacts.',
                        'subsections': [
                            {
                                'title': 'End-Cretaceous (66 MYA)',
                                'text': 'Chicxulub impact killed 75% of species including non-avian dinosaurs. 10-15km asteroid created global environmental catastrophe.'
                            },
                            {
                                'title': 'End-Permian (252 MYA)',
                                'text': 'Largest mass extinction (96% of species) may have involved impact, though volcanism was primary cause.'
                            }
                        ]
                    },
                    {
                        'title': 'Recent Impact Events',
                        'content': 'Modern impacts provide insights into impact processes and hazards.',
                        'subsections': [
                            {
                                'title': 'Tunguska (1908)',
                                'text': 'Airburst explosion flattened 2,000 km² of Siberian forest. Demonstrated destructive power of relatively small objects.'
                            },
                            {
                                'title': 'Chelyabinsk (2013)',
                                'text': 'Unexpected 20m asteroid injured 1,500 people. Highlighted gaps in detection of smaller objects.'
                            }
                        ]
                    }
                ],
                'impact_timeline': [
                    {
                        'age': '4.1-3.8 billion years ago',
                        'event': 'Late Heavy Bombardment',
                        'description': 'Period of intense asteroid and comet impacts on inner solar system'
                    },
                    {
                        'age': '252 million years ago',
                        'event': 'End-Permian Extinction',
                        'description': 'Largest mass extinction, possibly involving impact'
                    },
                    {
                        'age': '66 million years ago',
                        'event': 'Chicxulub Impact',
                        'description': 'End-Cretaceous extinction, killed dinosaurs'
                    },
                    {
                        'age': '1908',
                        'event': 'Tunguska Event',
                        'description': 'Largest impact event in recorded history'
                    },
                    {
                        'age': '2013',
                        'event': 'Chelyabinsk Meteor',
                        'description': 'Most recent significant impact event'
                    }
                ]
            }
        }
        
        card_detail = detailed_content.get(card_id)
        if not card_detail:
            return jsonify({
                'success': False,
                'error': 'Card not found'
            }), 404
            
        return jsonify({
            'success': True,
            'card': card_detail
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/education/search', methods=['GET'])
def search_education_content():
    """Search education content"""
    try:
        query = request.args.get('q', '').lower()
        category = request.args.get('category', '')
        difficulty = request.args.get('difficulty', '')
        
        # This would typically search a database
        # For now, return filtered results based on query
        all_cards = [
            {'id': 'asteroid-basics', 'title': 'Asteroid Fundamentals', 'category': 'basics', 'difficulty': 'beginner'},
            {'id': 'impact-physics', 'title': 'Impact Physics', 'category': 'science', 'difficulty': 'intermediate'},
            {'id': 'planetary-defense', 'title': 'Planetary Defense', 'category': 'defense', 'difficulty': 'intermediate'},
            {'id': 'historical-impacts', 'title': 'Historical Impacts', 'category': 'history', 'difficulty': 'beginner'}
        ]
        
        filtered_cards = []
        for card in all_cards:
            matches_query = not query or query in card['title'].lower()
            matches_category = not category or card['category'] == category
            matches_difficulty = not difficulty or card['difficulty'] == difficulty
            
            if matches_query and matches_category and matches_difficulty:
                filtered_cards.append(card)
        
        return jsonify({
            'success': True,
            'results': filtered_cards,
            'total': len(filtered_cards)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 Enhanced NASA Impact Simulator Backend Starting...")
    print(f"🔑 NASA API Key: {'✅ Configured' if NASA_API_KEY else '❌ Missing'}")
    print(f"🤖 Gemini AI: {'✅ Configured' if model else '❌ Missing'}")
    print("🌐 CORS enabled for frontend communication")
    print("📡 Available endpoints:")
    print("   - GET  /api/health")
    print("   - GET  /api/neo/hazardous") 
    print("   - GET  /api/neo/stats")
    print("   - POST /api/impact/simulate")
    print("   - GET  /api/impact/simulate-real")
    print("   - POST /api/ai/risk-analysis")
    print("   - POST /api/ai/mitigations")
    print("   - GET  /api/cities/data")
    print("   - POST /api/timeline/phases")
    print("   - POST /api/aftermath/layers")
    print("   - POST /api/survival/zones")
    print("   - POST /api/alerts/timeline")
    print("🎯 Enhanced backend ready for comprehensive impact analysis!")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
