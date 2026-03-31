import React, { useRef, useState, useEffect } from 'react';
import { Send, ImagePlus, Loader2, X } from 'lucide-react';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  image?: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string, image?: string) => void;
  isLoading: boolean;
  activeCrop?: string;
  weatherSummary?: string;
}

const MessageBubble: React.FC<{ msg: ChatMessage }> = ({ msg }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${msg.isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!msg.isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mr-2 shrink-0 shadow-md self-end mb-1">
          <span className="text-sm">🌱</span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-5 py-4 rounded-3xl shadow-sm ${
          msg.isUser
            ? 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-sm'
            : 'bg-white text-gray-800 border border-gray-100 shadow-md rounded-tl-sm'
        }`}
      >
        {msg.image && (
          <img src={msg.image} alt="User upload" className="w-full max-h-48 object-cover rounded-2xl mb-3" />
        )}
        <p className="text-base leading-8 whitespace-pre-wrap" style={{ fontFamily: "'Noto Sans Malayalam', 'Inter', sans-serif" }}>
          {msg.text}
        </p>
      </div>
      {msg.isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ml-2 shrink-0 shadow-sm self-end mb-1">
          <span className="text-sm">👤</span>
        </div>
      )}
    </div>
  );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, activeCrop, weatherSummary }) => {
  const [input, setInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || previewImage) {
      onSendMessage(input.trim(), previewImage || undefined);
      setInput('');
      setPreviewImage(null);
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col border border-gray-100 rounded-3xl bg-white shadow-md overflow-hidden flex-1 min-h-0">
      {/* Context Bar */}
      {(activeCrop || weatherSummary) && (
        <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-center gap-3 text-sm flex-wrap">
          {activeCrop && (
            <span className="flex items-center gap-1.5 bg-green-600 text-white font-semibold px-3 py-1 rounded-full shadow-sm">
              🌾 {activeCrop}
            </span>
          )}
          {!activeCrop && (
            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-500 font-medium px-3 py-1 rounded-full">
              🌱 പൊതു ചോദ്യം
            </span>
          )}
          {weatherSummary && (
            <span className="text-gray-500 font-medium">
              🌤️ {weatherSummary}
            </span>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/60">
        {messages.length === 0 ? (
          <div className="text-center mt-8 space-y-3">
            <div className="text-5xl">🌾</div>
            <p className="text-xl font-bold text-gray-700" style={{ fontFamily: "'Noto Sans Malayalam', 'Inter', sans-serif" }}>
              സഹായം ചോദിക്കാൻ തുടങ്ങൂ!
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['എൻ്റെ കൃഷികൾ ഏതൊക്കെ?', 'ഇന്നത്തെ കാലാവസ്ഥ ടിപ്സ്', 'രോഗ നിർണ്ണയം എങ്ങനെ?'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="text-xs bg-white border border-green-200 text-green-700 px-3 py-2 rounded-full hover:bg-green-50 hover:border-green-400 transition-all shadow-sm active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))
        )}

        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-sm">🌱</span>
            </div>
            <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-sm border border-gray-100 shadow-md flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
              <span className="text-base text-gray-500" style={{ fontFamily: "'Noto Sans Malayalam', 'Inter', sans-serif" }}>
                ആലോചിക്കുന്നു...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {previewImage && (
          <div className="relative inline-block mb-3 ml-1">
            <img src={previewImage} alt="Preview" className="h-20 w-20 object-cover rounded-2xl border-2 border-green-300 shadow-md" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-green-600 hover:bg-green-50 rounded-2xl transition-all active:scale-90 shadow-sm border border-gray-100 min-w-[48px] min-h-[48px] flex items-center justify-center"
            title="Upload plant photo"
          >
            <ImagePlus className="w-6 h-6" />
          </button>

          <div className="flex-1 flex items-center border-2 border-gray-200 rounded-3xl overflow-hidden focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10 transition-all bg-white shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(e as any); }}
              placeholder="നിങ്ങളുടെ ചോദ്യം ഇവിടെ എഴുതൂ..."
              className="flex-1 px-5 py-3 focus:outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent min-h-[44px]"
              style={{ fontFamily: "'Noto Sans Malayalam', 'Inter', sans-serif" }}
            />
          </div>

          <button
            type="submit"
            disabled={(!input.trim() && !previewImage) || isLoading}
            className={`p-3 rounded-2xl transition-all active:scale-90 shadow-md min-w-[48px] min-h-[48px] flex items-center justify-center ${
              (!input.trim() && !previewImage) || isLoading
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-br from-green-500 to-green-700 text-white hover:shadow-lg hover:shadow-green-600/30'
            }`}
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">Enter അമർത്തിയാൽ അയക്കും</p>
      </div>
    </div>
  );
};
