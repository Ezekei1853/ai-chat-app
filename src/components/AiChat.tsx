import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Settings, Moon, Sun } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatSettings {
  aiName: string;
  theme: 'light' | 'dark';
  maxMessages: number;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是你的AI助手，有什么可以帮助你的吗？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    aiName: 'AI助手',
    theme: 'light',
    maxMessages: 50
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      '这是一个很有趣的问题！让我想想...',
      '我理解你的意思，这确实值得深入思考。',
      '根据我的理解，我认为...',
      '这个话题很复杂，从多个角度来看...',
      '你提出了一个很好的观点！',
      '让我为你分析一下这个问题...',
      '我很乐意帮助你解决这个问题。',
      '这让我想到了一些相关的概念...'
    ];
    
    if (userMessage.toLowerCase().includes('你好') || userMessage.toLowerCase().includes('hello')) {
      return '你好！很高兴与你交流，有什么我可以帮助你的吗？';
    }
    
    if (userMessage.toLowerCase().includes('谢谢') || userMessage.toLowerCase().includes('thank')) {
      return '不客气！如果还有其他问题，随时告诉我。';
    }
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse} 关于"${userMessage}"，我觉得这是一个值得探讨的话题。你还想了解更多具体的信息吗？`;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(userMessage.content),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => {
        const newMessages = [...prev, aiResponse];
        // 限制消息数量
        if (newMessages.length > settings.maxMessages) {
          return newMessages.slice(-settings.maxMessages);
        }
        return newMessages;
      });
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: '聊天记录已清空。有什么新的问题吗？',
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const isDark = settings.theme === 'dark';

  // 内联样式对象
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      height: '100vh',
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      color: isDark ? '#ffffff' : '#333333',
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      borderRadius: '24px',
      overflow: 'hidden',
      position: 'relative' as const,
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 28px',
      background: isDark 
        ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${isDark ? '#333' : 'rgba(255,255,255,0.2)'}`,
      color: '#ffffff',
    },
    
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    
    avatar: {
      width: '52px',
      height: '52px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    },
    
    headerInfo: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    
    aiName: {
      fontSize: '22px',
      fontWeight: 'bold',
      margin: 0,
      color: '#ffffff',
    },
    
    status: {
      fontSize: '14px',
      opacity: 0.9,
      margin: '2px 0 0 0',
      color: '#ffffff',
    },
    
    headerButtons: {
      display: 'flex',
      gap: '8px',
    },
    
    iconButton: {
      padding: '12px',
      borderRadius: '50%',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      color: '#ffffff',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    settingsPanel: {
      padding: '24px 28px',
      background: isDark 
        ? 'linear-gradient(135deg, #2d2d2d 0%, #252525 100%)'
        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      borderBottom: `1px solid ${isDark ? '#333' : '#e2e8f0'}`,
    },
    
    settingsGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    
    settingsItem: {
      display: 'flex',
      flexDirection: 'column' as const,
    },
    
    label: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: isDark ? '#ffffff' : '#333333',
    },
    
    input: {
      padding: '12px 16px',
      border: `2px solid ${isDark ? '#444' : '#e2e8f0'}`,
      borderRadius: '12px',
      fontSize: '14px',
      background: isDark ? '#2d2d2d' : '#ffffff',
      color: isDark ? '#ffffff' : '#333333',
      transition: 'all 0.3s ease',
    },
    
    messagesContainer: {
      flex: 1,
      overflowY: 'auto' as const,
      padding: '24px 28px',
      background: isDark 
        ? 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)'
        : 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    },
    
    message: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '24px',
    },
    
    messageUser: {
      flexDirection: 'row-reverse' as const,
      gap: '16px',
    },
    
    messageAvatar: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontSize: '18px',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    
    aiAvatar: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    
    userAvatar: {
      background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
    },
    
    messageContentWrapper: {
      flex: 1,
      maxWidth: '75%',
      width:"auto",
    },
    
    messageContent: {
      padding: '16px 20px',
      borderRadius: '24px',
      fontSize: '15px',
      lineHeight: '1.6',
      position: 'relative' as const,
      wordWrap: 'break-word' as const,
    },
    
    aiMessageContent: {
      background: isDark 
        ? 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      color: isDark ? '#ffffff' : '#333333',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      border: `1px solid ${isDark ? '#444' : '#e2e8f0'}`,
    },
    
    userMessageContent: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
    },
    
    messageTime: {
      fontSize: '12px',
      opacity: 0.7,
      marginTop: '8px',
      color: isDark ? '#aaa' : '#666',
    },
    
    typingIndicator: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      marginBottom: '24px',
    },
    
    typingContent: {
      padding: '16px 20px',
      borderRadius: '24px',
      background: isDark 
        ? 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      border: `1px solid ${isDark ? '#444' : '#e2e8f0'}`,
    },
    
    typingDots: {
      display: 'flex',
      gap: '4px',
    },
    
    typingDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: isDark ? '#666' : '#999',
      animation: 'bounce 1.4s infinite ease-in-out',
    },
    
    inputArea: {
      padding: '24px 28px',
      background: isDark 
        ? 'linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%)'
        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderTop: `1px solid ${isDark ? '#333' : '#e2e8f0'}`,
    },
    
    inputGroup: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
    },
    
    chatInput: {
      flex: 1,
      padding: '16px 20px',
      border: `2px solid ${isDark ? '#444' : '#e2e8f0'}`,
      borderRadius: '24px',
      fontSize: '15px',
      background: isDark ? '#1a1a1a' : '#ffffff',
      color: isDark ? '#ffffff' : '#333333',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    
    sendButton: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            <Bot size={28} />
          </div>
          <div style={styles.headerInfo}>
            <h1 style={styles.aiName}>{settings.aiName}</h1>
            <p style={styles.status}>在线 • 随时为您服务</p>
          </div>
        </div>
        
        <div style={styles.headerButtons}>
          <button
            onClick={toggleTheme}
            style={styles.iconButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={styles.iconButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Settings size={20} />
          </button>
          <button
            onClick={clearChat}
            style={styles.iconButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,82,82,0.2)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={styles.settingsPanel}>
          <div style={styles.settingsGroup}>
            <div style={styles.settingsItem}>
              <label style={styles.label}>AI助手名称</label>
              <input
                type="text"
                value={settings.aiName}
                onChange={(e) => setSettings(prev => ({ ...prev, aiName: e.target.value }))}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#444' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={styles.settingsItem}>
              <label style={styles.label}>最大消息数量</label>
              <input
                type="number"
                min="10"
                max="200"
                value={settings.maxMessages}
                onChange={(e) => setSettings(prev => ({ ...prev, maxMessages: parseInt(e.target.value) }))}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#444' : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              ...styles.message,
              ...(message.sender === 'user' ? styles.messageUser : {})
            }}
          >
            <div style={{
              ...styles.messageAvatar,
              ...(message.sender === 'ai' ? styles.aiAvatar : styles.userAvatar)
            }}>
              {message.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
            </div>
            
            <div style={styles.messageContentWrapper}>
              <div style={{
                ...styles.messageContent,
                ...(message.sender === 'ai' ? styles.aiMessageContent : styles.userMessageContent),
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}>
                {message.content}
              </div>
              <div style={{
                ...styles.messageTime,
                textAlign: message.sender === 'user' ? 'right' : 'left'
              }}>
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={styles.typingIndicator}>
            <div style={{...styles.messageAvatar, ...styles.aiAvatar}}>
              <Bot size={20} />
            </div>
            <div style={styles.typingContent}>
              <div style={styles.typingDots}>
                <div style={{...styles.typingDot, animationDelay: '0s'}}></div>
                <div style={{...styles.typingDot, animationDelay: '0.2s'}}></div>
                <div style={{...styles.typingDot, animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <div style={styles.inputGroup}>
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的消息..."
            disabled={isTyping}
            style={styles.chatInput}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isDark ? '#444' : '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isTyping}
            style={{
              ...styles.sendButton,
              opacity: (!inputMessage.trim() || isTyping) ? 0.5 : 1,
              cursor: (!inputMessage.trim() || isTyping) ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!(!inputMessage.trim() || isTyping)) {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
            }}
          >
            <Send size={22} />
          </button>
        </div>
      </div>

      {/* 添加动画样式 */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AIChat;