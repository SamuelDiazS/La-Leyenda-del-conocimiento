'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { Send, MessageSquare } from 'lucide-react';

export const ChatBox: React.FC = () => {
  const { chatMessages, addChatMessage, character } = useGameStore();
  const [inputText, setInputText] = useState('');
  const [activeChannel, setActiveChannel] = useState<'all' | 'global' | 'system'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const sender = character?.name || 'Viajero';
    addChatMessage({
      id: `msg_${Date.now()}`,
      senderName: sender,
      channel: 'global',
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setInputText('');
  };

  const filteredMessages = chatMessages.filter((msg) => {
    if (activeChannel === 'all') return true;
    if (activeChannel === 'global') return msg.channel === 'global';
    if (activeChannel === 'system') return msg.channel === 'system';
    return true;
  });

  return (
    <div className="pointer-events-auto absolute bottom-7 left-4 w-80 h-44 bg-game-panel/90 border border-game-border-gold/60 rounded-xl shadow-rpg backdrop-blur-sm flex flex-col z-20 overflow-hidden text-xs">
      {/* Channel Tabs */}
      <div className="flex border-b border-gray-800 bg-game-panel-light/80 px-2 pt-1 gap-2 text-[10px] font-bold">
        <button
          onClick={() => setActiveChannel('all')}
          className={`pb-1 px-1 transition-colors ${
            activeChannel === 'all'
              ? 'text-game-gold border-b-2 border-game-gold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          General
        </button>
        <button
          onClick={() => setActiveChannel('global')}
          className={`pb-1 px-1 transition-colors ${
            activeChannel === 'global'
              ? 'text-cyan-400 border-b-2 border-cyan-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Mundo
        </button>
        <button
          onClick={() => setActiveChannel('system')}
          className={`pb-1 px-1 transition-colors ${
            activeChannel === 'system'
              ? 'text-amber-400 border-b-2 border-amber-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Sistema
        </button>
      </div>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 p-2 overflow-y-auto flex flex-col gap-1 font-sans">
        {filteredMessages.map((msg) => {
          let nameColor = 'text-cyan-400';
          let textColor = 'text-gray-200';

          if (msg.channel === 'system') {
            nameColor = 'text-amber-400';
            textColor = 'text-amber-200 italic';
          }

          return (
            <div key={msg.id} className="leading-tight break-words text-[11px]">
              <span className="text-gray-500 mr-1 text-[9px]">[{msg.timestamp}]</span>
              <span className={`font-bold mr-1 ${nameColor}`}>[{msg.senderName}]:</span>
              <span className={textColor}>{msg.message}</span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-1.5 bg-black/50 border-t border-gray-800 flex gap-1">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe en el chat global..."
          className="flex-1 bg-game-panel border border-gray-700 rounded px-2 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-game-gold"
        />
        <button
          type="submit"
          className="px-2 py-1 bg-game-panel-light hover:bg-game-border border border-gray-700 rounded text-game-gold transition-colors"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
