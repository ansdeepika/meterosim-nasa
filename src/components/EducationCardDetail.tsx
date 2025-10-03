import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Star, ExternalLink, Calculator, Calendar, Rocket } from 'lucide-react';
import { EducationApiClient, DetailedEducationCard } from '../services/educationApiClient';

// Use the imported interface instead of defining locally

const EducationCardDetail: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<DetailedEducationCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const fetchCardDetail = async () => {
      try {
        setLoading(true);
        console.log(`Fetching card detail for: ${cardId}`);
        const cardData = await EducationApiClient.getCardDetail(cardId!);
        console.log(`Loaded card data:`, cardData);
        setCard(cardData);
      } catch (err) {
        setError('Failed to load card details');
        console.error('Error fetching card detail:', err);
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardDetail();
    }
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#020111] to-[#05103a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading detailed content...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#020111] to-[#05103a] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold mb-4">Content Not Found</h2>
          <p className="text-gray-400 mb-6">{error || 'The requested educational content could not be found.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Complete')) return 'text-green-400';
    if (status.includes('En Route') || status.includes('Active')) return 'text-blue-400';
    return 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#020111] to-[#05103a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-r ${card.gradient}`}>
                <span className="text-2xl">{card.emoji}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{card.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span className={`px-2 py-1 rounded-full ${getDifficultyColor(card.difficulty)}`}>
                    {card.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {card.readingTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {card.category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="w-32" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Introduction */}
        <div className="glass-card p-8 mb-8">
          <p className="text-xl text-gray-300 leading-relaxed">{card.description}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {card.detailed_sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setActiveSection(index)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeSection === index
                  ? `bg-gradient-to-r ${card.gradient} text-white`
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {card.detailed_sections[activeSection]?.title}
              </h2>
              
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                {card.detailed_sections[activeSection]?.content}
              </p>

              {/* Subsections */}
              <div className="space-y-6">
                {card.detailed_sections[activeSection]?.subsections.map((subsection, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-6">
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      {subsection.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {subsection.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interactive Elements */}
            {card.interactive_elements && card.interactive_elements.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Interactive Data
                </h3>
                {card.interactive_elements.map((element, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="font-semibold mb-3">{element.title}</h4>
                    <div className="space-y-2">
                      {element.data.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center p-2 bg-white/5 rounded">
                          <span className="text-sm">{item.name}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold">{item.diameter}km</div>
                            <div className="text-xs text-gray-400">{item.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recent Discoveries */}
            {card.recent_discoveries && card.recent_discoveries.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Recent Discoveries
                </h3>
                <div className="space-y-4">
                  {card.recent_discoveries.map((discovery, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4">
                      <div className="text-xs text-gray-400 mb-1">{discovery.date}</div>
                      <h4 className="font-semibold text-blue-300 mb-2">{discovery.title}</h4>
                      <p className="text-sm text-gray-300">{discovery.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Missions */}
            {card.related_missions && card.related_missions.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Related Missions
                </h3>
                <div className="space-y-3">
                  {card.related_missions.map((mission, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded">
                      <div>
                        <div className="font-semibold">{mission.name}</div>
                        <div className="text-sm text-gray-400">{mission.target}</div>
                      </div>
                      <div className={`text-sm font-semibold ${getStatusColor(mission.status)}`}>
                        {mission.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {(card.mission_timeline || card.impact_timeline) && (
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  {(card.mission_timeline || card.impact_timeline || []).map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-16 text-sm text-purple-400 font-semibold">
                        {'year' in event ? event.year : event.age}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{event.event}</h4>
                        <p className="text-sm text-gray-400">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
          <button
            onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
            disabled={activeSection === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Section
          </button>
          
          <div className="text-sm text-gray-400">
            Section {activeSection + 1} of {card.detailed_sections.length}
          </div>
          
          <button
            onClick={() => setActiveSection(Math.min(card.detailed_sections.length - 1, activeSection + 1))}
            disabled={activeSection === card.detailed_sections.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Section
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default EducationCardDetail;