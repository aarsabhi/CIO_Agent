import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText, Loader2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  files?: string[];
}

interface ChatProps {
  uploadedFiles: File[];
}

const Chat: React.FC<ChatProps> = ({ uploadedFiles }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your CIO Assistant. I can help you analyze uploaded documents, generate reports, and provide insights. What would you like to know?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate API call to backend
    setTimeout(() => {
      // Smart responses based on keywords
      const query = inputText.toLowerCase();
      let response = "";
      
      if (query.includes('security') || query.includes('vulnerability')) {
        response = "Based on our latest security assessment, I've identified 3 critical vulnerabilities requiring immediate attention. The authentication system needs patches within 48 hours, and we have suspicious login attempts in EU-Central region.";
      } else if (query.includes('budget') || query.includes('cost') || query.includes('financial')) {
        response = "Current budget analysis shows 87% efficiency with $2.3M potential savings through cloud optimization. Infrastructure spending is 8.4% over budget, but security investments are 11.25% under budget.";
      } else if (query.includes('performance') || query.includes('uptime') || query.includes('system')) {
        response = "System performance is strong with 99.97% uptime. However, APAC region shows 78ms latency (target: <50ms). EU-Central has 4 incidents this week, requiring infrastructure attention.";
      } else if (query.includes('project') || query.includes('timeline')) {
        response = "Currently tracking 5 active projects: Cloud Migration (67% complete), Zero Trust Security (45% complete), and Data Analytics Platform (85% complete). Network Infrastructure Upgrade is delayed and needs resource reallocation.";
      } else if (query.includes('team') || query.includes('staff') || query.includes('resource')) {
        response = "Team performance metrics show 87% efficiency. We need 2 additional developers for Q1 projects. DevOps team has resource constraints affecting project timelines. User satisfaction is at 4.2/5.";
      } else if (query.includes('risk') || query.includes('threat')) {
        response = "Top risks include legacy system dependencies (Critical), cybersecurity threats (High), and talent retention (Medium). Recommend accelerating modernization roadmap and enhanced security monitoring.";
      } else {
        const generalResponses = [
          "I can help you analyze IT performance metrics, security incidents, budget allocation, and project status. What specific area would you like to explore?",
          "Based on uploaded documents and real-time data, I can provide insights on system performance, security posture, and operational efficiency.",
          "I'm monitoring 4 regions with 67,000 total users. Current focus areas include APAC latency issues and EU-Central security incidents."
        ];
        response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
      }
      
      const assistantMessage: Message = {
        id: messages.length + 2,
        text: response,
        sender: 'assistant',
        timestamp: new Date(),
        files: uploadedFiles.length > 0 ? [uploadedFiles[0].name] : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-500">
              {uploadedFiles.length > 0 ? `${uploadedFiles.length} files uploaded` : 'No files uploaded yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gradient-to-br from-blue-600 to-purple-600'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  {message.files && (
                    <div className="mt-2 flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">Referenced: {message.files.join(', ')}</span>
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md xl:max-w-lg">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your IT infrastructure..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;