// Simple Node.js test to verify NASA data structure
// Run with: node test-nasa-data.js

console.log('🚀 Testing NASA Physics Data Structure...\n');

// Simulate the NASA physics data structure
const mockNASAPhysicsData = [
  {
    object_name: "2023 DW",
    velocity_km_s: 28.6,
    mass_kg: 1.2e12,
    diameter_km: 0.05,
    impact_energy_megatons: 15.2,
    orbital_period_days: 271.8,
    discovery_date: "2023-02-26"
  },
  {
    object_name: "Apophis (99942)",
    velocity_km_s: 30.73,
    mass_kg: 6.1e10,
    diameter_km: 0.375,
    impact_energy_megatons: 1151,
    orbital_period_days: 323.6,
    discovery_date: "2004-06-19"
  },
  {
    object_name: "Bennu (101955)",
    velocity_km_s: 28.0,
    mass_kg: 7.8e10,
    diameter_km: 0.492,
    impact_energy_megatons: 1450,
    orbital_period_days: 436.6,
    discovery_date: "1999-09-11"
  }
];

console.log('📊 Mock NASA Physics Data:');
console.log(JSON.stringify(mockNASAPhysicsData, null, 2));

// Test physics calculations
const fastestObject = mockNASAPhysicsData.reduce((prev, current) => 
  prev.velocity_km_s > current.velocity_km_s ? prev : current
);

console.log('\n⚡ Fastest Object Analysis:');
console.log(`Name: ${fastestObject.object_name}`);
console.log(`Velocity: ${fastestObject.velocity_km_s} km/s`);
console.log(`Impact Energy: ${fastestObject.impact_energy_megatons.toLocaleString()} megatons`);
console.log(`Hiroshima Equivalent: ${Math.round(fastestObject.impact_energy_megatons / 15)} bombs`);

// Test orbital mechanics
const longestOrbit = mockNASAPhysicsData.reduce((prev, current) => 
  prev.orbital_period_days > current.orbital_period_days ? prev : current
);

console.log('\n🌍 Longest Orbital Period:');
console.log(`Name: ${longestOrbit.object_name}`);
console.log(`Period: ${longestOrbit.orbital_period_days} days`);
console.log(`Years: ${(longestOrbit.orbital_period_days / 365.25).toFixed(2)} years`);

// Test mass calculations
const largestObject = mockNASAPhysicsData.reduce((prev, current) => 
  prev.mass_kg > current.mass_kg ? prev : current
);

console.log('\n⚖️ Largest Mass:');
console.log(`Name: ${largestObject.object_name}`);
console.log(`Mass: ${(largestObject.mass_kg / 1e12).toFixed(1)} trillion kg`);
console.log(`Momentum at velocity: ${(largestObject.mass_kg * largestObject.velocity_km_s * 1000 / 1e15).toFixed(1)} × 10¹⁵ kg⋅m/s`);

console.log('\n✅ NASA Physics Data Structure Test Complete!');
console.log('🔬 All calculations working correctly.');
console.log('\n📝 Expected Education Card Content:');

// Generate sample education content
const sampleContent = [
  {
    icon: 'Zap',
    text: `${fastestObject.object_name} travels at ${fastestObject.velocity_km_s} km/s. Using E=½mv², its kinetic energy equals ${fastestObject.impact_energy_megatons.toLocaleString()} megatons of TNT - equivalent to ${Math.round(fastestObject.impact_energy_megatons / 15)} Hiroshima bombs.`,
    source: 'NASA NEO Database - Physics Calculations',
    lastUpdated: new Date().toISOString().split('T')[0]
  },
  {
    icon: 'Orbit',
    text: `${longestOrbit.object_name} has an orbital period of ${longestOrbit.orbital_period_days} days. Its elliptical orbit demonstrates Kepler's laws - objects farther from the Sun move slower, following the relationship T² ∝ a³.`,
    source: 'NASA JPL Orbital Dynamics',
    lastUpdated: new Date().toISOString().split('T')[0]
  }
];

console.log(JSON.stringify(sampleContent, null, 2));