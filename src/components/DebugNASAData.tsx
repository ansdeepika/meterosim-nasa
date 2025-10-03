import React, { useState } from 'react';
import { EducationAPIService } from '../services/educationApiService';

const DebugNASAData: React.FC = () => {
  const [nasaData, setNasaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testNASAPhysicsData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing NASA Physics Data...');
      const data = await EducationAPIService.fetchNASAPhysicsData();
      console.log('NASA Physics Data:', data);
      setNasaData(data);
    } catch (err) {
      console.error('Error fetching NASA data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testEnhancedCard = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing Enhanced Science Card...');
      const card = await EducationAPIService.fetchCachedEducationContent('science');
      console.log('Enhanced Science Card:', card);
      setNasaData(card);
    } catch (err) {
      console.error('Error fetching enhanced card:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-4">🔬 NASA Data Debug Panel</h2>
      
      <div className="space-y-4">
        <button
          onClick={testNASAPhysicsData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test NASA Physics Data'}
        </button>
        
        <button
          onClick={testEnhancedCard}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 ml-2"
        >
          {loading ? 'Loading...' : 'Test Enhanced Science Card'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-600 rounded-lg">
          <h3 className="font-bold">Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {nasaData && (
        <div className="mt-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Data Retrieved:</h3>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(nasaData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DebugNASAData;