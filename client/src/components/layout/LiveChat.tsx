import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

const LiveChat: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! How can we help you today?',
      sender: 'system',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputMessage.trim() === '') return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    
    // Simulate response after 1 second
    setTimeout(() => {
      const systemResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message! Our team will respond shortly.',
        sender: 'system',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, systemResponse]);
    }, 1000);
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="w-14 h-14 bg-[#34bdf2] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#2193c9] transition"
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        <i className="fas fa-comment-dots text-xl"></i>
      </button>
      
      <div 
        className={`absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${isChatOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transform: isChatOpen ? 'scale(1)' : 'scale(0.95)', transformOrigin: 'bottom right' }}
      >
        <div className="gradient-bg p-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">LIMBS Orthopaedic Chat</h3>
            <button 
              className="text-white hover:text-gray-200"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <p className="text-sm mt-1">We typically reply within minutes</p>
        </div>
        
        <div className="h-80 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : ''}`}
            >
              <div 
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.sender === 'user' 
                    ? 'bg-[#34bdf2] text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <span 
                  className={`text-xs mt-1 block ${
                    message.sender === 'user' 
                      ? 'text-white text-opacity-70' 
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t flex">
          <Input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#34bdf2]"
          />
          <Button 
            type="submit" 
            className="bg-[#34bdf2] text-white px-4 py-2 rounded-r-md hover:bg-[#2193c9] transition"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LiveChat;
