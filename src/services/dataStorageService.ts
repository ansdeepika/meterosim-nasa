// Enhanced data storage service for education cards
import { EducationCard, EducationContent } from './educationService';

// Types for persistent data
export interface UserProgress {
  cardId: string;
  readingProgress: number;
  completedAt?: string;
  timeSpent: number; // in seconds
  lastAccessed: string;
}

export interface UserPreferences {
  favoriteCards: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  autoUpdate: boolean;
  notifications: boolean;
}

export interface CardEngagement {
  cardId: string;
  views: number;
  expansions: number;
  completions: number;
  totalTimeSpent: number;
  lastViewed: string;
}

export interface StoredCardData {
  id: string;
  content: EducationContent[];
  lastUpdated: string;
  source: 'static' | 'api' | 'user';
  version: number;
}

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'meteorsim_user_progress',
  USER_PREFERENCES: 'meteorsim_user_preferences',
  CARD_ENGAGEMENT: 'meteorsim_card_engagement',
  STORED_CARDS: 'meteorsim_stored_cards',
  BOOKMARKS: 'meteorsim_bookmarks',
  NOTES: 'meteorsim_user_notes'
};

class DataStorageService {
  // === USER PROGRESS MANAGEMENT ===
  
  saveUserProgress(cardId: string, progress: number, timeSpent: number = 0): void {
    const allProgress = this.getAllUserProgress();
    const existingProgress = allProgress.find(p => p.cardId === cardId);
    
    if (existingProgress) {
      existingProgress.readingProgress = progress;
      existingProgress.timeSpent += timeSpent;
      existingProgress.lastAccessed = new Date().toISOString();
      if (progress >= 100 && !existingProgress.completedAt) {
        existingProgress.completedAt = new Date().toISOString();
      }
    } else {
      allProgress.push({
        cardId,
        readingProgress: progress,
        timeSpent,
        lastAccessed: new Date().toISOString(),
        ...(progress >= 100 && { completedAt: new Date().toISOString() })
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));
  }
  
  getUserProgress(cardId: string): UserProgress | null {
    const allProgress = this.getAllUserProgress();
    return allProgress.find(p => p.cardId === cardId) || null;
  }
  
  getAllUserProgress(): UserProgress[] {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    return stored ? JSON.parse(stored) : [];
  }
  
  // === USER PREFERENCES ===
  
  saveUserPreferences(preferences: Partial<UserPreferences>): void {
    const current = this.getUserPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  }
  
  getUserPreferences(): UserPreferences {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : {
      favoriteCards: [],
      difficulty: 'all',
      autoUpdate: true,
      notifications: true
    };
  }
  
  // === CARD ENGAGEMENT TRACKING ===
  
  trackEngagement(cardId: string, action: 'view' | 'expand' | 'complete', timeSpent: number = 0): void {
    const allEngagement = this.getAllEngagement();
    const existing = allEngagement.find(e => e.cardId === cardId);
    
    if (existing) {
      switch (action) {
        case 'view':
          existing.views++;
          break;
        case 'expand':
          existing.expansions++;
          break;
        case 'complete':
          existing.completions++;
          break;
      }
      existing.totalTimeSpent += timeSpent;
      existing.lastViewed = new Date().toISOString();
    } else {
      allEngagement.push({
        cardId,
        views: action === 'view' ? 1 : 0,
        expansions: action === 'expand' ? 1 : 0,
        completions: action === 'complete' ? 1 : 0,
        totalTimeSpent: timeSpent,
        lastViewed: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEYS.CARD_ENGAGEMENT, JSON.stringify(allEngagement));
  }
  
  getEngagement(cardId: string): CardEngagement | null {
    const allEngagement = this.getAllEngagement();
    return allEngagement.find(e => e.cardId === cardId) || null;
  }
  
  getAllEngagement(): CardEngagement[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CARD_ENGAGEMENT);
    return stored ? JSON.parse(stored) : [];
  }
  
  // === CARD DATA STORAGE ===
  
  storeCardData(card: EducationCard, source: 'static' | 'api' | 'user' = 'static'): void {
    const allStoredCards = this.getAllStoredCards();
    const existingIndex = allStoredCards.findIndex(c => c.id === card.id);
    
    const storedCard: StoredCardData = {
      id: card.id,
      content: card.content,
      lastUpdated: new Date().toISOString(),
      source,
      version: existingIndex >= 0 ? allStoredCards[existingIndex].version + 1 : 1
    };
    
    if (existingIndex >= 0) {
      allStoredCards[existingIndex] = storedCard;
    } else {
      allStoredCards.push(storedCard);
    }
    
    localStorage.setItem(STORAGE_KEYS.STORED_CARDS, JSON.stringify(allStoredCards));
  }
  
  getStoredCardData(cardId: string): StoredCardData | null {
    const allStoredCards = this.getAllStoredCards();
    return allStoredCards.find(c => c.id === cardId) || null;
  }
  
  getAllStoredCards(): StoredCardData[] {
    const stored = localStorage.getItem(STORAGE_KEYS.STORED_CARDS);
    return stored ? JSON.parse(stored) : [];
  }
  
  // === BOOKMARKS & FAVORITES ===
  
  addToFavorites(cardId: string): void {
    const preferences = this.getUserPreferences();
    if (!preferences.favoriteCards.includes(cardId)) {
      preferences.favoriteCards.push(cardId);
      this.saveUserPreferences(preferences);
    }
  }
  
  removeFromFavorites(cardId: string): void {
    const preferences = this.getUserPreferences();
    preferences.favoriteCards = preferences.favoriteCards.filter(id => id !== cardId);
    this.saveUserPreferences(preferences);
  }
  
  isFavorite(cardId: string): boolean {
    const preferences = this.getUserPreferences();
    return preferences.favoriteCards.includes(cardId);
  }
  
  // === USER NOTES ===
  
  saveUserNote(cardId: string, note: string): void {
    const allNotes = this.getAllUserNotes();
    allNotes[cardId] = {
      note,
      createdAt: allNotes[cardId]?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(allNotes));
  }
  
  getUserNote(cardId: string): { note: string; createdAt: string; updatedAt: string } | null {
    const allNotes = this.getAllUserNotes();
    return allNotes[cardId] || null;
  }
  
  getAllUserNotes(): Record<string, { note: string; createdAt: string; updatedAt: string }> {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
    return stored ? JSON.parse(stored) : {};
  }
  
  // === DATA EXPORT/IMPORT ===
  
  exportAllData(): string {
    const data = {
      userProgress: this.getAllUserProgress(),
      userPreferences: this.getUserPreferences(),
      cardEngagement: this.getAllEngagement(),
      storedCards: this.getAllStoredCards(),
      userNotes: this.getAllUserNotes(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    return JSON.stringify(data, null, 2);
  }
  
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.userProgress) {
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(data.userProgress));
      }
      if (data.userPreferences) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.userPreferences));
      }
      if (data.cardEngagement) {
        localStorage.setItem(STORAGE_KEYS.CARD_ENGAGEMENT, JSON.stringify(data.cardEngagement));
      }
      if (data.storedCards) {
        localStorage.setItem(STORAGE_KEYS.STORED_CARDS, JSON.stringify(data.storedCards));
      }
      if (data.userNotes) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(data.userNotes));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
  
  // === DATA CLEANUP ===
  
  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
  
  clearOldData(daysOld: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Clean old progress data
    const progress = this.getAllUserProgress();
    const recentProgress = progress.filter(p => 
      new Date(p.lastAccessed) > cutoffDate
    );
    localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(recentProgress));
    
    // Clean old engagement data
    const engagement = this.getAllEngagement();
    const recentEngagement = engagement.filter(e => 
      new Date(e.lastViewed) > cutoffDate
    );
    localStorage.setItem(STORAGE_KEYS.CARD_ENGAGEMENT, JSON.stringify(recentEngagement));
  }
  
  // === STATISTICS ===
  
  getStatistics() {
    const progress = this.getAllUserProgress();
    const engagement = this.getAllEngagement();
    const preferences = this.getUserPreferences();
    
    return {
      totalCardsViewed: engagement.length,
      totalCompletions: progress.filter(p => p.completedAt).length,
      totalTimeSpent: engagement.reduce((sum, e) => sum + e.totalTimeSpent, 0),
      favoriteCardsCount: preferences.favoriteCards.length,
      averageProgress: progress.length > 0 
        ? progress.reduce((sum, p) => sum + p.readingProgress, 0) / progress.length 
        : 0,
      mostViewedCard: engagement.sort((a, b) => b.views - a.views)[0]?.cardId || null,
      lastActivity: Math.max(
        ...progress.map(p => new Date(p.lastAccessed).getTime()),
        ...engagement.map(e => new Date(e.lastViewed).getTime())
      )
    };
  }
}

// Create singleton instance
export const dataStorage = new DataStorageService();

// Export the service
export { DataStorageService };