import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import { config } from '../../config/env';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!config.openRouter.apiKey) {
      setMessages([{ 
        role: 'assistant', 
        content: 'Mi dispiace, il servizio di chat AI non è al momento disponibile.'
      }]);
      return;
    }
    
    setMessages([{
      role: 'assistant',
      content: 'Ciao! Sono l\'assistente virtuale del Centro Medico Plus. Come posso aiutarti?'
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Verifica API key
      if (!config.openRouter.apiKey || config.openRouter.apiKey.trim() === '') {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Mi dispiace, il servizio di chat AI non è configurato correttamente.'
        }]);
        setLoading(false);
        return;
      }

      const res = await fetch(config.openRouter.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openRouter.apiKey}`,
          'HTTP-Referer': window.location.origin
        },
        body: JSON.stringify({
          model: "mistral/mistral-7b-instruct",
          messages: messages.concat([{ role: "user", content: userMessage }])
        })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from AI service');
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      }]);
    } catch (error) {
      console.error('Error calling AI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Mi dispiace, si è verificato un errore di comunicazione con il servizio AI. Riprova più tardi.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-rose-600 text-white p-3 rounded-full shadow-lg hover:bg-rose-700 transition-colors z-50"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl flex flex-col max-h-[600px] z-50">
      <div className="p-4 border-b flex justify-between items-center bg-rose-600 text-white rounded-t-lg">
        <h3 className="font-medium">Assistente AI</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-rose-100 text-gray-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-rose-600 text-white p-2 rounded-md hover:bg-rose-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}