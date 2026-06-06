import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatbotMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Mathie, your math learning companion! 🎓 Ask me anything about math or need help with a problem?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'Help with algebra',
    'Explain fractions',
    'Study tips',
    'Practice problems'
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('algebra')) {
      return "Algebra is all about solving for unknowns! The key is to isolate the variable. For example, in x + 5 = 12, subtract 5 from both sides to get x = 7. Would you like to try a practice problem?";
    } else if (lowerMessage.includes('fraction')) {
      return "Fractions represent parts of a whole! The top number (numerator) tells you how many parts you have, and the bottom (denominator) tells you how many equal parts make up the whole. Need help with adding or multiplying fractions?";
    } else if (lowerMessage.includes('study') || lowerMessage.includes('tip')) {
      return "Great study tips: 1) Practice regularly, even just 15 minutes a day! 2) Start with easier problems to build confidence. 3) Write out your work step by step. 4) Teach concepts to someone else - it helps you learn better! Want more specific advice?";
    } else if (lowerMessage.includes('practice')) {
      return "I'd love to help you practice! Check out the lessons in your learning path. Start with problems at your level and gradually increase difficulty. Which topic would you like to practice today?";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('stuck')) {
      return "No worries, everyone gets stuck sometimes! Can you tell me which specific topic or problem you're working on? I'll break it down step by step for you.";
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return "Hello! 👋 I'm here to make math fun and easy. What would you like to learn about today?";
    } else if (lowerMessage.includes('thank')) {
      return "You're very welcome! Keep up the great work! Remember, every mathematician started where you are now. 🌟";
    } else {
      return "That's an interesting question! While I'm still learning, I can help you with basic algebra, geometry, fractions, and general math tips. What specific topic would you like to explore?";
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 text-white shadow-lg flex items-center justify-center z-50"
          >
            <MessageCircle className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-card rounded-2xl shadow-2xl border border-border flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-chart-1 to-chart-2 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg">Mathie</h3>
                  <p className="text-xs opacity-90">Your AI Math Tutor</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-chart-1 to-chart-2 text-white'
                        : 'bg-secondary'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1 rounded-full bg-secondary hover:bg-secondary/80 text-xs transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Mathie anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 transition-all"
                />
                <button
                  onClick={handleSend}
                  className="p-2 rounded-xl bg-gradient-to-r from-chart-1 to-chart-2 text-white hover:opacity-90 transition-opacity"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
