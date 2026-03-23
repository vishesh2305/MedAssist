'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, User, MapPin, Stethoscope, Search,
  Pill, AlertTriangle, ArrowLeft, Loader2, Sparkles,
  Building2, MessageSquare,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { MobileNav } from '@/components/layout/MobileNav';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { id: 'find-hospital', label: 'Find Hospital', icon: Building2, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'check-symptoms', label: 'Check Symptoms', icon: Stethoscope, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'medicine-info', label: 'Medicine Info', icon: Pill, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
];

const quickPrompts: Record<string, string> = {
  'find-hospital': 'I need to find a hospital near me. Can you help me find the closest one?',
  'check-symptoms': 'I would like to check my symptoms. I have been feeling unwell.',
  'medicine-info': 'I need information about a medicine. Can you help me understand its uses and side effects?',
  'emergency': 'I need emergency medical assistance. What should I do right now?',
};

const systemResponses: Record<string, string> = {
  'find-hospital': 'I can help you find a hospital! To give you the best recommendations, could you tell me:\n\n1. What is your current location or city?\n2. Do you need a specific specialty (e.g., cardiology, orthopedics)?\n3. Do you need emergency services?\n4. Any language preferences?\n\nYou can also go to our [Hospitals page](/hospitals) for a full searchable directory with maps.',
  'check-symptoms': 'I can help you assess your symptoms. Please describe what you are experiencing:\n\n- What symptoms do you have?\n- When did they start?\n- How severe are they (1-10)?\n- Any medications you are currently taking?\n\n**Important:** This is an AI assessment and not a substitute for professional medical advice. If you are experiencing severe symptoms, please seek immediate medical attention.',
  'medicine-info': 'I can help you with medicine information. Please tell me:\n\n1. What is the medicine name?\n2. Are you looking for:\n   - Uses and indications\n   - Side effects\n   - Drug interactions\n   - Dosage information\n   - Equivalent medicines in another country\n\nYou can also check our [Pharmacy Finder](/pharmacy) for medicine equivalents worldwide.',
  'emergency': '**If you are experiencing a medical emergency, please call local emergency services immediately.**\n\nHere are some immediate steps:\n\n1. **Call Emergency Services** - Dial the local emergency number\n2. **Use our Emergency SOS** - Go to [Emergency page](/emergency) for one-tap hospital contact\n3. **Stay calm** and try to describe your location clearly\n4. **Do not move** if you have a suspected spinal injury\n\nCommon emergency numbers:\n- Europe: 112\n- USA: 911\n- Thailand: 1669\n- India: 108',
  'default': 'I am MedAssist AI, your health companion for traveling. I can help you with:\n\n- Finding hospitals and clinics nearby\n- Checking symptoms and providing health guidance\n- Medicine information and equivalents\n- Emergency medical assistance\n- Travel health tips and vaccination info\n\nHow can I assist you today?',
};

export default function HealthAssistantPage() {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your MedAssist AI Health Companion. I can help you with finding hospitals, checking symptoms, medicine information, and emergency assistance.\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=10`
            );
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.state || '';
            const country = data.address?.country || '';
            setUserLocation(`${city}${city && country ? ', ' : ''}${country}`);
          } catch {
            setUserLocation('Location detected');
          }
        },
        () => setUserLocation('Location unavailable')
      );
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Try API first
      const { data } = await api.post('/ai/chat', {
        message: content,
        context: {
          location: userLocation,
          userId: user?.id,
        },
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.data?.response || data.data?.message || 'I understand your concern. Let me help you with that.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Generate a contextual response locally
      const lowerContent = content.toLowerCase();
      let response = '';

      if (lowerContent.includes('hospital') || lowerContent.includes('clinic') || lowerContent.includes('doctor')) {
        response = 'I can help you find a hospital! Based on your query, I recommend:\n\n1. Visit our [Hospitals page](/hospitals) to search by location, specialty, and language\n2. Use the Emergency page if you need immediate assistance\n3. You can also use our Pharmacy Finder to locate nearby pharmacies\n\nWould you like me to help with anything specific?';
      } else if (lowerContent.includes('symptom') || lowerContent.includes('pain') || lowerContent.includes('fever') || lowerContent.includes('sick') || lowerContent.includes('headache')) {
        response = 'I understand you are not feeling well. Here are some general recommendations:\n\n1. **Monitor your symptoms** - Note when they started and their severity\n2. **Stay hydrated** - Drink plenty of water\n3. **Rest** - Your body needs energy to recover\n4. **Seek medical attention** if symptoms are severe or worsening\n\nWould you like me to help you find a nearby hospital or check specific symptoms?';
      } else if (lowerContent.includes('medicine') || lowerContent.includes('drug') || lowerContent.includes('medication') || lowerContent.includes('pharmacy')) {
        response = 'For medicine-related queries, I recommend:\n\n1. Visit our [Pharmacy Finder](/pharmacy) to find equivalent medicines in different countries\n2. Always consult with a healthcare professional before taking new medication\n3. Carry your prescriptions when traveling internationally\n\nWhat specific medicine would you like to know about?';
      } else if (lowerContent.includes('emergency') || lowerContent.includes('urgent') || lowerContent.includes('help')) {
        response = systemResponses['emergency'];
      } else if (lowerContent.includes('vaccine') || lowerContent.includes('vaccination') || lowerContent.includes('travel')) {
        response = 'For travel health planning, I recommend:\n\n1. Visit our [Trip Planner](/trip-planner) to get vaccination requirements for your destination\n2. Check the [Embassy Directory](/embassies) for emergency contacts\n3. Store your vaccination records in your [Medical Passport](/medical-passport)\n\nWhich country are you planning to visit?';
      } else {
        response = `Thank you for your message. I am here to help with your health-related questions.\n\nHere are some things I can assist with:\n- **Find hospitals** near your location\n- **Check symptoms** and get health guidance\n- **Medicine information** and equivalents\n- **Emergency assistance**\n- **Travel health** planning\n\nCould you provide more details about what you need help with?`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    const prompt = quickPrompts[actionId];
    if (prompt) {
      sendMessage(prompt);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderMessageContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Bold
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Links
      rendered = rendered.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary-600 dark:text-primary-400 underline hover:no-underline">$1</a>');
      // List items
      if (rendered.startsWith('- ')) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2">
            <span className="h-1.5 w-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} />
          </div>
        );
      }
      if (/^\d+\.\s/.test(rendered)) {
        return (
          <div key={i} className="ml-2" dangerouslySetInnerHTML={{ __html: rendered }} />
        );
      }
      if (rendered.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <div key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        {/* Location Bar */}
        {userLocation && (
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="max-w-3xl mx-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 text-primary-500" />
              <span>{userLocation}</span>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-bl-md'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions (only show when few messages) */}
            {messages.length <= 1 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 transition-colors text-left"
                  >
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', action.color)}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800/30 px-4 py-2">
          <p className="text-xs text-center text-yellow-700 dark:text-yellow-400 max-w-3xl mx-auto">
            This AI health companion is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
          </p>
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              disabled={isTyping}
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500 transition-colors disabled:opacity-50"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!input.trim() || isTyping}
              icon={isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            >
              Send
            </Button>
          </form>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
