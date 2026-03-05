import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Bot, 
  User, 
  Plus, 
  MessageSquare, 
  History, 
  Settings, 
  HelpCircle,
  LayoutDashboard,
  Bell,
  Share2
} from 'lucide-react';
import { motion } from 'framer-motion';

const Chat = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello Sarah! I'm here to help you navigate financial opportunities. I can provide details on government subsidies, loan schemes, and investment portfolios tailored for women entrepreneurs. What are your goals today?"
    },
    {
      id: 2,
      sender: 'user',
      text: "Can you recommend some government schemes for women entrepreneurs starting a tech business?"
    },
    {
      id: 3,
      sender: 'bot',
      text: "Absolutely! For a tech startup, here are the top 3 government-backed schemes currently available in your region:",
      cards: [
        {
          title: "Mudra Yojana",
          desc: "Up to ₹10,00,000 collateral-free loan for small enterprises.",
          tag: "TOP CHOICE"
        },
        {
          title: "Stree Shakti Package",
          desc: "Concession in interest rates for businesses with >50% female ownership.",
          tag: "RECOMMENDED"
        }
      ]
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">NariConnect</span>
            <span className="text-xs text-rose-500 font-medium mt-1 ml-1">AI</span>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30 mb-8">
            <Plus size={20} /> New Chat
          </button>

          <div className="space-y-6 flex-1 overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">History</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium">
                  <MessageSquare size={16} />
                  Women Entrepreneurship...
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">
                  <History size={16} />
                  Small Business Loans
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">
                  <History size={16} />
                  Tax Saving for 2024
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Resources</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                  Investment Schemes
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium">
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                  Savings Goals
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-rose-500 rounded-lg text-sm font-medium transition-colors mb-4">
              <HelpCircle size={18} /> Support Center
            </button>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-rose-100 overflow-hidden">
                <img src={user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || "User"}</p>
                <p className="text-xs text-rose-500">Pro Member</p>
              </div>
              <Settings size={18} className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-gray-50 relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bot className="text-rose-500" />
            <span className="font-bold text-gray-900">NariConnect AI</span>
            <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">BETA</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Bell size={20} className="hover:text-gray-600 cursor-pointer" />
            <Share2 size={20} className="hover:text-gray-600 cursor-pointer" />
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="text-center my-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask me anything about financial schemes</h1>
            <p className="text-gray-500">Personalized financial advice for the modern woman entrepreneur.</p>
          </div>

          {messages.map((msg) => (
            <motion.div 
              key={msg.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-rose-100' : 'bg-rose-500'}`}>
                {msg.sender === 'user' ? (
                  <img src={user?.imageUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Bot className="text-white w-6 h-6" />
                )}
              </div>
              
              <div className={`max-w-2xl space-y-4 ${msg.sender === 'user' ? 'items-end flex flex-col' : ''}`}>
                <div className={`p-6 rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-rose-500 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>

                {msg.cards && (
                  <div className="grid md:grid-cols-2 gap-4 w-full">
                    {msg.cards.map((card, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
                            <LayoutDashboard size={20} />
                          </div>
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-1 rounded-full">{card.tag}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">{card.title}</h4>
                        <p className="text-sm text-gray-500">{card.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <Paperclip size={20} />
            </div>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message about financial schemes..."
              className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent placeholder-gray-400"
            />
            
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSend}
                className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-md shadow-rose-500/20"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-3 font-medium tracking-wide uppercase">
            NariConnect AI can provide guidance but is not a substitute for professional legal or financial advice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Chat;
