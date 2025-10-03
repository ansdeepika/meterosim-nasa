import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Upload, Trash2, Settings, TrendingUp } from 'lucide-react';
import { dataStorage } from '../services/dataStorageService';

interface UserStats {
  totalCardsViewed: number;
  totalCompletions: number;
  totalTimeSpent: number;
  favoriteCardsCount: number;
  averageProgress: number;
  mostViewedCard: string | null;
  lastActivity: number;
}

const UserDataDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showExportData, setShowExportData] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const statistics = dataStorage.getStatistics();
    setStats(statistics);
  };

  const handleExportData = () => {
    const exportedData = dataStorage.exportAllData();
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meteorsim-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    try {
      const success = dataStorage.importData(importData);
      if (success) {
        alert('Data imported successfully!');
        setImportData('');
        setShowImport(false);
        loadStats();
      } else {
        alert('Failed to import data. Please check the format.');
      }
    } catch (error) {
      alert('Invalid data format.');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      dataStorage.clearAllData();
      loadStats();
      alert('All data cleared successfully.');
    }
  };

  const handleClearOldData = () => {
    if (confirm('Clear data older than 30 days?')) {
      dataStorage.clearOldData(30);
      loadStats();
      alert('Old data cleared successfully.');
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!stats) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded"></div>
            <div className="h-3 bg-white/10 rounded w-5/6"></div>
            <div className="h-3 bg-white/10 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics Overview */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Your Learning Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.totalCardsViewed}</div>
            <div className="text-xs text-gray-400">Cards Viewed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.totalCompletions}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{formatTime(stats.totalTimeSpent)}</div>
            <div className="text-xs text-gray-400">Time Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{stats.favoriteCardsCount}</div>
            <div className="text-xs text-gray-400">Favorites</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Average Progress:</span>
            <span className="text-white">{Math.round(stats.averageProgress)}%</span>
          </div>
          {stats.mostViewedCard && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Most Viewed:</span>
              <span className="text-white capitalize">{stats.mostViewedCard}</span>
            </div>
          )}
          {stats.lastActivity > 0 && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-400">Last Activity:</span>
              <span className="text-white">{new Date(stats.lastActivity).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Data Management</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Data */}
          <div className="space-y-2">
            <button
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg text-green-400 hover:text-green-300 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <p className="text-xs text-gray-400">Download all your progress and notes</p>
          </div>

          {/* Import Data */}
          <div className="space-y-2">
            <button
              onClick={() => setShowImport(!showImport)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition-all duration-300"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </button>
            <p className="text-xs text-gray-400">Restore from exported data</p>
          </div>

          {/* Clear Old Data */}
          <div className="space-y-2">
            <button
              onClick={handleClearOldData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4" />
              Clear Old Data
            </button>
            <p className="text-xs text-gray-400">Remove data older than 30 days</p>
          </div>

          {/* Clear All Data */}
          <div className="space-y-2">
            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Data
            </button>
            <p className="text-xs text-gray-400">⚠️ This cannot be undone</p>
          </div>
        </div>

        {/* Import Data Section */}
        {showImport && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="space-y-3">
              <label className="block text-sm text-gray-400">
                Paste exported data JSON:
              </label>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your exported JSON data here..."
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleImportData}
                  disabled={!importData.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm transition-colors duration-300"
                >
                  Import
                </button>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportData('');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDataDashboard;