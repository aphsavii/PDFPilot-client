import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/shadcn/ui/card';
import { Alert, AlertDescription } from '@/shadcn/ui/alert';
import { ScrollArea } from '@/shadcn/ui/scroll-area';

function ChatPage() {
  const { fileId } = useParams();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
  
    setLoading(true);
    setError('');
    setMessages(prev => [...prev, { type: 'user', content: query }]);
    const submittedQuery = query;
    setQuery('');
  
    try {
      const response = await fetch('http://4.186.56.232:3000/ask/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileId, query: submittedQuery }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
  
      let botResponse = '';
      setMessages(prev => [...prev, { type: 'bot', content: '' }]);
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = line.slice(6);
              const data = JSON.parse(jsonData);
              botResponse += data.answer;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  type: 'bot',
                  content: botResponse,
                };
                return newMessages;
              });
            } catch (error) {
              console.error("Error parsing JSON:", error, "Raw data:", line.slice(6));
            }
          }
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4 h-[calc(100vh-100px)] flex flex-col fixed lg:static">
      <Card className="flex-grow flex flex-col">
        <CardHeader>
          <CardTitle>Chat with PDF</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col overflow-hidden">
          <ScrollArea className="flex-grow pr-4 h-[calc(100vh-280px)]" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{__html:message.content}}></div>
                    {message.type === 'bot' && loading && index === messages.length - 1 && (
                      <span className="inline-block w-1 h-4 ml-1 bg-gray-500 animate-pulse"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {error && (
            <Alert variant="destructive" className="my-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleQuery} className="flex space-x-2 mt-4">
            <Input
              type="text"
              placeholder="Ask a question about the PDF"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !query.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChatPage;