import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, BookmarkPlus, FileText, ExternalLink } from 'lucide-react';
import { EducationService, EducationCard } from '../services/educationService';
import { EducationApiClient } from '../services/educationApiClient';
import { dataStorage } from '../services/dataStorageService';
import { liveNASADataService } from '../services/liveNASADataService';

const EducationCards: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState<{[key: string]: number}>({});
  const [cards, setCards] = useState<EducationCard[]>(EducationService.EDUCATION_CARDS);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCards, setFilteredCards] = useState<EducationCard[]>(EducationService.EDUCATION_CARDS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState<{[key: string]: string}>({});

  // Initialize data from storage and API
  useEffect(() => {
    const initializeData = async () => {
      // Load user preferences and progress
      const preferences = dataStorage.getUserPreferences();
      setFavorites(preferences.favoriteCards);
      
      // Load existing progress
      const allProgress = dataStorage.getAllUserProgress();
      const progressMap: {[key: string]: number} = {};
      allProgress.forEach(p => {
        progressMap[p.cardId] = p.readingProgress;
      });
      setReadProgress(progressMap);
      
      // Load user notes
      const allNotes = dataStorage.getAllUserNotes();
      const notesMap: {[key: string]: string} = {};
      Object.entries(allNotes).forEach(([cardId, noteData]) => {
        notesMap[cardId] = noteData.note;
      });
      setUserNotes(notesMap);
      
      // Try to load cards from API first, fallback to static data
      try {
        const apiClient = new EducationApiClient();
        const apiCards = await apiClient.getAllCards();
        if (apiCards && apiCards.length > 0) {
          setCards(apiCards);
          setFilteredCards(apiCards);
          return;
        }
      } catch (error) {
        console.error('Failed to load cards from API, using static data:', error);
      }
      
      // Fallback: Load stored card data if available
      const storedCards = dataStorage.getAllStoredCards();
      if (storedCards.length > 0) {
        const updatedCards = EducationService.EDUCATION_CARDS.map(card => {
          const storedCard = storedCards.find(sc => sc.id === card.id);
          if (storedCard) {
            return { ...card, content: storedCard.content };
          }
          return card;
        });
        setCards(updatedCards);
        setFilteredCards(updatedCards);
      } else {
        // Use static cards as final fallback
        setCards(EducationService.EDUCATION_CARDS);
        setFilteredCards(EducationService.EDUCATION_CARDS);
      }
    };

    initializeData();
  }, []);

  const toggleCard = async (cardId: string) => {
    const isExpanding = expandedCard !== cardId;
    setExpandedCard(expandedCard === cardId ? null : cardId);
    
    // Track engagement with enhanced storage
    dataStorage.trackEngagement(cardId, isExpanding ? 'expand' : 'view');
    
    // Start progress tracking when expanding
    if (isExpanding) {
      const card = cards.find(c => c.id === cardId);
      if (card) {
        // Fetch enhanced content with real-time data
        setLoading(prev => ({ ...prev, [cardId]: true }));
        try {
          // For Live NASA Data card, fetch real-time data
          if (cardId === 'live-nasa-data') {
            console.log('🚀 Fetching live NASA data for education card...');
            const liveContent = await liveNASADataService.getUpdatedEducationContent();
            
            // Update the card with live data
            const updatedCard = cards.find(c => c.id === cardId);
            if (updatedCard) {
              const liveCard: EducationCard = {
                ...updatedCard,
                content: [
                  {
                    icon: updatedCard.content[0].icon,
                    text: liveContent.neoFeedText,
                    source: 'NASA NEO Observations Program - Live Feed',
                    lastUpdated: new Date().toISOString().split('T')[0]
                  },
                  {
                    icon: updatedCard.content[1].icon,
                    text: liveContent.statisticsText,
                    source: 'NASA JPL Center for NEO Studies - Live API',
                    lastUpdated: new Date().toISOString().split('T')[0]
                  },
                  {
                    icon: updatedCard.content[2].icon,
                    text: liveContent.closeApproachText,
                    source: 'NASA JPL Close Approach Database - Live',
                    lastUpdated: new Date().toISOString().split('T')[0]
                  },
                  {
                    icon: updatedCard.content[3].icon,
                    text: liveContent.fireballText,
                    source: 'NASA Meteor Environment Office - Live Data',
                    lastUpdated: new Date().toISOString().split('T')[0]
                  },
                  ...updatedCard.content.slice(4) // Keep other content items
                ]
              };
              setCards(prev => prev.map(c => c.id === cardId ? liveCard : c));
              dataStorage.storeCardData(liveCard, 'live-nasa');
            }
            return; // Skip the API client call for live data
          }
          
          const apiClient = new EducationApiClient();
          const enhancedCard = await apiClient.getCardDetail(cardId);
          if (enhancedCard) {
              // Convert detailed card to list items expected by the UI
              // We map each detailed section to a list entry and include recent discoveries if present
              const sectionItems = enhancedCard.detailed_sections.map(section => ({
                icon: FileText,
                text: section.content,
                source: enhancedCard.title,
                lastUpdated: new Date().toISOString()
              }));

              const discoveryItems = (enhancedCard.recent_discoveries || []).map(d => ({
                icon: Telescope,
                text: `${d.title}: ${d.description}`,
                source: `Discovery ${d.date}`,
                lastUpdated: new Date().toISOString()
              }));

              const basicCard: EducationCard = {
                id: enhancedCard.id,
                title: enhancedCard.title,
                emoji: enhancedCard.emoji,
                difficulty: enhancedCard.difficulty as any,
                readingTime: enhancedCard.readingTime,
                category: enhancedCard.category as any,
                // description is not part of EducationCard interface; keep local only
                content: [...sectionItems, ...discoveryItems],
                gradient: enhancedCard.gradient,
                icon: cards.find(c => c.id === cardId)?.icon || BookOpen
              } as EducationCard;

              setCards(prev => prev.map(c => c.id === cardId ? basicCard : c));
              // Store the enhanced card data
              dataStorage.storeCardData(basicCard, 'api');
            }
        } catch (error) {
          console.error('Failed to fetch enhanced content:', error);
          // Fallback to static content
          const fallbackCard = await EducationService.fetchUpdatedEducationContent(cardId);
          if (fallbackCard) {
            setCards(prev => prev.map(c => c.id === cardId ? fallbackCard : c));
          }
        } finally {
          setLoading(prev => ({ ...prev, [cardId]: false }));
        }
        
        // Get existing progress or start from 0
        const existingProgress = dataStorage.getUserProgress(cardId);
        let progress = existingProgress?.readingProgress || 0;
        const startTime = Date.now();
        
        // Simulate reading progress over time based on estimated reading time
        const readingTimeMs = card.readingTime * 60 * 1000; // Convert minutes to milliseconds
        const intervalTime = readingTimeMs / 100; // 100 steps to complete
        
        const interval = setInterval(() => {
          progress += 1;
          setReadProgress(prev => ({ ...prev, [cardId]: progress }));
          
          // Save progress to storage
          const timeSpent = Math.floor((Date.now() - startTime) / 1000);
          dataStorage.saveUserProgress(cardId, progress, timeSpent);
          
          if (progress >= 100) {
            clearInterval(interval);
            dataStorage.trackEngagement(cardId, 'complete');
          }
        }, intervalTime);
      }
    }
  };

  // Helper functions for favorites and notes
  const toggleFavorite = (cardId: string) => {
    if (favorites.includes(cardId)) {
      dataStorage.removeFromFavorites(cardId);
      setFavorites(prev => prev.filter(id => id !== cardId));
    } else {
      dataStorage.addToFavorites(cardId);
      setFavorites(prev => [...prev, cardId]);
    }
  };

  const saveNote = (cardId: string, note: string) => {
    dataStorage.saveUserNote(cardId, note);
    setUserNotes(prev => ({ ...prev, [cardId]: note }));
  };

  const navigateToDetailView = (cardId: string) => {
    // Track navigation engagement
    dataStorage.trackEngagement(cardId, 'navigate_detail');
    navigate(`/education/${cardId}`);
  };

  // Handle search filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filtered = EducationService.searchEducationCards(searchQuery);
      setFilteredCards(filtered);
    }
  }, [searchQuery, cards]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expandedCard) {
        setExpandedCard(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [expandedCard]);

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Learn More
        </h3>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search educational content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Results count */}
        {searchQuery && (
          <p className="text-sm text-gray-400 mt-2">
            Found {filteredCards.length} result{filteredCards.length !== 1 ? 's' : ''} for "{searchQuery}"
          </p>
        )}
      </div>
      
      {filteredCards.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg mb-2">🔍 No results found</p>
          <p className="text-sm">Try searching for "asteroid", "defense", or "impact"</p>
        </div>
      ) : (
        filteredCards.map((card) => (
        <div 
          key={card.id} 
          className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative group"
          title={`Click to learn about ${card.title.toLowerCase()}`}
        >
          <button
            onClick={() => toggleCard(card.id)}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-300 group"
            aria-expanded={expandedCard === card.id}
            aria-controls={`card-content-${card.id}`}
            disabled={loading[card.id]}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${card.gradient} group-hover:scale-110 transition-transform duration-300 ${loading[card.id] ? 'animate-pulse' : ''}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{card.emoji}</span>
                  <h4 className="text-lg font-semibold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {card.title}
                  </h4>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      card.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      card.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {card.difficulty}
                    </span>
                    <span className="text-xs text-gray-400">
                      📖 {card.readingTime}min
                    </span>
                    {favorites.includes(card.id) && (
                      <span className="text-xs text-red-400">❤️</span>
                    )}
                    {userNotes[card.id] && (
                      <span className="text-xs text-blue-400">📝</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {loading[card.id] ? 'Loading updated content...' : 
                   `Click to ${expandedCard === card.id ? 'collapse' : 'expand'} details`}
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-gray-400 transition-all duration-300 group-hover:text-white ${
                expandedCard === card.id ? 'rotate-90' : ''
              } ${loading[card.id] ? 'animate-spin' : ''}`} 
            />
          </button>
          
          <div 
            id={`card-content-${card.id}`}
            className={`overflow-hidden transition-all duration-500 ${
              expandedCard === card.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-6 pt-0 border-t border-white/10">
              <ul className="space-y-4">
                {card.content.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 text-gray-300 hover:text-white transition-colors duration-300 p-3 rounded-lg hover:bg-white/5 group/item">
                    <div className={`p-2 rounded-full bg-gradient-to-r ${card.gradient} flex-shrink-0 opacity-80 group-hover/item:opacity-100 transition-opacity duration-300`}>
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm leading-relaxed block mb-2">{item.text}</span>
                      {(item.source || item.lastUpdated) && (
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {item.source && (
                            <span className="flex items-center gap-1">
                              📚 {item.source}
                            </span>
                          )}
                          {item.lastUpdated && (
                            <span className="flex items-center gap-1">
                              🕒 Updated {new Date(item.lastUpdated).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Additional interactive elements */}
              <div className="mt-6 pt-4 border-t border-white/10">
                {/* Reading Progress Bar */}
                {readProgress[card.id] && readProgress[card.id] > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>📖 Reading Progress</span>
                      <span>{readProgress[card.id]}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-1000`}
                        style={{ width: `${readProgress[card.id]}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  {/* User Notes Section */}
                  <div className="border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Personal Notes</span>
                    </div>
                    <textarea
                      value={userNotes[card.id] || ''}
                      onChange={(e) => saveNote(card.id, e.target.value)}
                      placeholder="Add your personal notes about this topic..."
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                      rows={2}
                    />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>💡 {card.content.length} key insights</span>
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(card.id);
                        }}
                        className={`hover:text-white transition-colors duration-300 flex items-center gap-1 ${
                          favorites.includes(card.id) ? 'text-red-400' : ''
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${favorites.includes(card.id) ? 'fill-current' : ''}`} />
                        {favorites.includes(card.id) ? 'Favorited' : 'Add to favorites'}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard?.writeText(`Check out these ${card.title.toLowerCase()} facts from MeteorSim!`);
                        }}
                        className="hover:text-white transition-colors duration-300 flex items-center gap-1"
                      >
                        📋 Copy to share
                      </button>
                      {readProgress[card.id] === 100 && (
                        <span className="text-green-400 flex items-center gap-1">
                          ✅ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Learn More Button */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToDetailView(card.id);
                      }}
                      className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${card.gradient} text-white font-semibold hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group`}
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      Learn More - Detailed Guide
                      <span className="text-xs opacity-75">({card.readingTime}+ min)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
      )}
    </div>
  );
};

export default EducationCards;