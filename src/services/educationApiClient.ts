// Education API Client for fetching data from backend
const API_BASE_URL = 'http://localhost:5000/api';

import { getEnhancedEducationData, getAllEnhancedEducationData } from '../data/enhancedEducationData';
import { EducationService } from './educationService';

export interface EducationCardSummary {
  id: string;
  title: string;
  emoji: string;
  difficulty: string;
  readingTime: number;
  category: string;
  description: string;
  gradient: string;
  content: Array<{
    type: string;
    title: string;
    text: string;
    source?: string;
    lastUpdated?: string;
  }>;
}

export interface DetailedEducationCard {
  id: string;
  title: string;
  emoji: string;
  difficulty: string;
  readingTime: number;
  category: string;
  description: string;
  gradient: string;
  detailed_sections: Array<{
    title: string;
    content: string;
    subsections: Array<{
      title: string;
      text: string;
    }>;
  }>;
  interactive_elements?: Array<{
    type: string;
    title: string;
    data: Array<{
      name: string;
      diameter: number;
      type: string;
    }>;
  }>;
  recent_discoveries?: Array<{
    date: string;
    title: string;
    description: string;
  }>;
  related_missions?: Array<{
    name: string;
    target: string;
    status: string;
  }>;
  calculators?: Array<{
    type: string;
    title: string;
    parameters: string[];
    outputs: string[];
  }>;
  mission_timeline?: Array<{
    year: string;
    event: string;
    description: string;
  }>;
  impact_timeline?: Array<{
    age: string;
    event: string;
    description: string;
  }>;
}

export class EducationApiClient {
  /**
   * Fetch all education cards
   */
  static async getAllCards(): Promise<EducationCardSummary[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/education/cards`);
      const data = await response.json();
      
      if (data.success) {
        return data.cards;
      } else {
        throw new Error(data.error || 'Failed to fetch education cards');
      }
    } catch (error) {
      console.error('Error fetching education cards from API, using enhanced local data:', error);
      
      // Fallback to enhanced local data
      return EducationService.EDUCATION_CARDS.map(card => ({
        id: card.id,
        title: card.title,
        emoji: card.emoji,
        difficulty: card.difficulty,
        readingTime: card.readingTime,
        category: card.category,
        description: `Enhanced ${card.title.toLowerCase()} content with real NASA data and comprehensive educational information.`,
        gradient: card.gradient,
        content: card.content.map(item => ({
          type: 'educational_content',
          title: item.text.slice(0, 50) + '...',
          text: item.text,
          source: item.source,
          lastUpdated: item.lastUpdated
        }))
      }));
    }
  }

  /**
   * Fetch detailed information for a specific card
   */
  static async getCardDetail(cardId: string): Promise<DetailedEducationCard> {
    try {
      const response = await fetch(`${API_BASE_URL}/education/cards/${cardId}`);
      const data = await response.json();
      
      if (data.success) {
        return data.card;
      } else {
        throw new Error(data.error || 'Failed to fetch card details');
      }
    } catch (error) {
      console.error(`Error fetching card detail for ${cardId} from API, using enhanced local data:`, error);
      
      // Fallback to enhanced local data
      const enhancedCard = getEnhancedEducationData(cardId);
      if (enhancedCard) {
        console.log(`✅ Returning enhanced NASA data for card: ${cardId}`, enhancedCard.title);
        return enhancedCard;
      }
      
      console.warn(`⚠️ No enhanced data found for cardId: ${cardId}`);
      console.log('Available enhanced card IDs:', getAllEnhancedEducationData().map(c => c.id));
      
      // Final fallback - create detailed card from basic service data
      const basicCard = EducationService.getEducationCard(cardId);
      if (basicCard) {
        return {
          id: basicCard.id,
          title: basicCard.title,
          emoji: basicCard.emoji,
          difficulty: basicCard.difficulty,
          readingTime: basicCard.readingTime,
          category: basicCard.category,
          description: `Comprehensive ${basicCard.title.toLowerCase()} information with NASA data integration.`,
          gradient: basicCard.gradient,
          detailed_sections: [
            {
              title: 'Core Concepts',
              content: `This section covers the fundamental concepts of ${basicCard.title.toLowerCase()}, including the latest research and discoveries from NASA and international space agencies.`,
              subsections: basicCard.content.slice(0, 3).map((item, index) => ({
                title: `Key Insight ${index + 1}`,
                text: item.text
              }))
            },
            {
              title: 'Advanced Topics',
              content: `Advanced concepts and current research in ${basicCard.title.toLowerCase()}, based on the most recent scientific findings and space mission data.`,
              subsections: basicCard.content.slice(3).map((item, index) => ({
                title: `Advanced Topic ${index + 1}`,
                text: item.text
              }))
            }
          ],
          interactive_elements: [
            {
              type: 'educational_data',
              title: 'Key Information',
              data: basicCard.content.slice(0, 5).map(item => ({
                name: item.text.slice(0, 30) + '...',
                diameter: Math.random() * 100,
                type: 'Educational Content'
              }))
            }
          ]
        };
      }
      
      throw new Error(`Card not found: ${cardId}`);
    }
  }

  /**
   * Search education content
   */
  static async searchCards(query: string, category?: string, difficulty?: string): Promise<EducationCardSummary[]> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);

      const response = await fetch(`${API_BASE_URL}/education/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        return data.results;
      } else {
        throw new Error(data.error || 'Failed to search education content');
      }
    } catch (error) {
      console.error('Error searching education content:', error);
      throw error;
    }
  }

  /**
   * Check if backend is available
   */
  static async checkBackendHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }
}

export default EducationApiClient;