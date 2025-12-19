import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMine: boolean;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  status: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatMessages, setChatMessages] = useState<{ [key: number]: Message[] }>({});

  useEffect(() => {
    const savedChats = localStorage.getItem('wolf_chats');
    const savedMessages = localStorage.getItem('wolf_messages');
    
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    } else {
      const initialChats = [
        { id: 1, name: 'Александр Волков', lastMessage: 'Отличная идея! Встречаемся завтра', time: '14:23', unread: 2, avatar: '🐺', status: 'online' },
        { id: 2, name: 'Дизайн команда', lastMessage: 'Марина: Прототип готов', time: '13:45', unread: 5, avatar: '🎨', status: 'online' },
        { id: 3, name: 'Екатерина Смирнова', lastMessage: 'Фото: природа.jpg', time: '12:10', unread: 0, avatar: '🌸', status: 'away' },
        { id: 4, name: 'Проект WOLF', lastMessage: 'Иван: Всем привет!', time: '11:30', unread: 12, avatar: '🚀', status: 'online' },
      ];
      setChats(initialChats);
      localStorage.setItem('wolf_chats', JSON.stringify(initialChats));
    }

    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages));
    } else {
      const initialMessages = {
        1: [
          { id: 1, sender: 'Александр Волков', text: 'Привет! Как дела с проектом?', time: '14:15', isMine: false },
          { id: 2, sender: 'Я', text: 'Всё отлично! Завершаю последние детали', time: '14:18', isMine: true },
          { id: 3, sender: 'Александр Волков', text: 'Отличная идея! Встречаемся завтра', time: '14:23', isMine: false },
        ]
      };
      setChatMessages(initialMessages);
      localStorage.setItem('wolf_messages', JSON.stringify(initialMessages));
    }
  }, []);

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'Я',
      text: messageInput,
      time: timeString,
      isMine: true
    };

    const updatedMessages = {
      ...chatMessages,
      [selectedChat]: [...(chatMessages[selectedChat] || []), newMessage]
    };
    
    setChatMessages(updatedMessages);
    localStorage.setItem('wolf_messages', JSON.stringify(updatedMessages));

    const updatedChats = chats.map(chat => 
      chat.id === selectedChat 
        ? { ...chat, lastMessage: messageInput, time: timeString, unread: 0 }
        : chat
    );
    setChats(updatedChats);
    localStorage.setItem('wolf_chats', JSON.stringify(updatedChats));

    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const currentMessages = selectedChat ? (chatMessages[selectedChat] || []) : [];

  const mockGroups = [
    { id: 1, name: 'Проект WOLF', members: 47, avatar: '🚀', lastActivity: '5 мин назад' },
    { id: 2, name: 'Дизайн команда', members: 12, avatar: '🎨', lastActivity: '1 час назад' },
    { id: 3, name: 'Семья', members: 8, avatar: '❤️', lastActivity: '3 часа назад' },
  ];

  const mockEvents = [
    { id: 1, title: 'Презентация WOLF', date: '25 Декабря', time: '18:00', attendees: 24, icon: '🎯' },
    { id: 2, title: 'Дизайн-спринт', date: '28 Декабря', time: '10:00', attendees: 12, icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-6 space-y-8">
        <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
          <img src="https://cdn.poehali.dev/projects/b5ad7d7a-57ef-47f6-88e3-7980384538e9/files/e609de3a-c1c4-4509-af42-53a7aba81515.jpg" alt="WOLF" className="w-10 h-10 object-contain" />
        </div>
        
        <nav className="flex flex-col items-center space-y-6 flex-1">
          <Button 
            variant={activeTab === 'chats' ? 'default' : 'ghost'} 
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'chats' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageCircle" size={24} />
          </Button>
          
          <Button 
            variant={activeTab === 'calls' ? 'default' : 'ghost'} 
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'calls' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('calls')}
          >
            <Icon name="Phone" size={24} />
          </Button>
          
          <Button 
            variant={activeTab === 'groups' ? 'default' : 'ghost'} 
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'groups' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('groups')}
          >
            <Icon name="Users" size={24} />
          </Button>
          
          <Button 
            variant={activeTab === 'events' ? 'default' : 'ghost'} 
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'events' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('events')}
          >
            <Icon name="Calendar" size={24} />
          </Button>
          
          <Button 
            variant={activeTab === 'media' ? 'default' : 'ghost'} 
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'media' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('media')}
          >
            <Icon name="Image" size={24} />
          </Button>
          
          <Button 
            variant={activeTab === 'polls' ? 'default' : 'ghost'} 
            size="icon"
            className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'polls' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
            onClick={() => setActiveTab('polls')}
          >
            <Icon name="BarChart3" size={24} />
          </Button>
        </nav>

        <Button 
          variant={activeTab === 'profile' ? 'default' : 'ghost'} 
          size="icon"
          className={`w-12 h-12 rounded-xl transition-all ${activeTab === 'profile' ? 'gold-gradient shadow-lg' : 'hover:bg-muted'}`}
          onClick={() => setActiveTab('profile')}
        >
          <Icon name="User" size={24} />
        </Button>
      </div>

      {/* Chat List */}
      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold mb-4 text-shadow-gold">
            {activeTab === 'chats' && 'Чаты'}
            {activeTab === 'calls' && 'Звонки'}
            {activeTab === 'groups' && 'Группы'}
            {activeTab === 'events' && 'Мероприятия'}
            {activeTab === 'media' && 'Медиа'}
            {activeTab === 'polls' && 'Опросы'}
            {activeTab === 'profile' && 'Профиль'}
          </h1>
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Поиск..." 
              className="pl-10 bg-muted border-border rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {activeTab === 'chats' && (
            <div className="p-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-4 rounded-xl mb-2 transition-all hover:bg-muted ${
                    selectedChat === chat.id ? 'glassmorphism' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {chat.avatar}
                      </div>
                      {chat.status === 'online' && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{chat.name}</h3>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <Badge className="ml-2 gold-gradient text-black font-bold">{chat.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="p-2">
              {mockGroups.map((group) => (
                <div key={group.id} className="p-4 rounded-xl mb-2 glassmorphism hover:bg-muted transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                      {group.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{group.name}</h3>
                      <p className="text-sm text-muted-foreground">{group.members} участников • {group.lastActivity}</p>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4 gold-gradient text-black font-bold rounded-xl">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать группу
              </Button>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="p-2">
              {mockEvents.map((event) => (
                <div key={event.id} className="p-4 rounded-xl mb-2 glassmorphism hover:bg-muted transition-all">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center text-2xl">
                      {event.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{event.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2">
                        <Icon name="Calendar" size={14} />
                        <span>{event.date} в {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2 mt-1">
                        <Icon name="Users" size={14} />
                        <span>{event.attendees} участников</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4 gold-gradient text-black font-bold rounded-xl">
                <Icon name="Plus" size={20} className="mr-2" />
                Создать мероприятие
              </Button>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center text-5xl">
                  👤
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-1">Ваше Имя</h2>
                  <p className="text-sm text-muted-foreground">@username</p>
                </div>
                <div className="w-full space-y-2 mt-6">
                  <Button variant="outline" className="w-full justify-start rounded-xl border-border">
                    <Icon name="Settings" size={20} className="mr-3" />
                    Настройки
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl border-border">
                    <Icon name="Bell" size={20} className="mr-3" />
                    Уведомления
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl border-border">
                    <Icon name="Shield" size={20} className="mr-3" />
                    Приватность
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl border-border">
                    <Icon name="Wifi" size={20} className="mr-3" />
                    Оффлайн режим
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-6 border-b border-border glassmorphism">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                    🐺
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Александр Волков</h2>
                    <p className="text-sm text-green-400 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      В сети
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                    <Icon name="Phone" size={20} />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                    <Icon name="Video" size={20} />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                    <Icon name="MoreVertical" size={20} />
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4 max-w-4xl mx-auto">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-4 rounded-2xl ${
                        message.isMine
                          ? 'gold-gradient text-black ml-12'
                          : 'glassmorphism mr-12'
                      }`}
                    >
                      {!message.isMine && (
                        <p className="text-xs font-semibold mb-1 text-primary">{message.sender}</p>
                      )}
                      <p className={message.isMine ? 'text-black' : 'text-foreground'}>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isMine ? 'text-black/70' : 'text-muted-foreground'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-border glassmorphism">
              <div className="flex items-center space-x-3 max-w-4xl mx-auto">
                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                  <Icon name="Paperclip" size={20} />
                </Button>
                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-muted">
                  <Icon name="Image" size={20} />
                </Button>
                <Input 
                  placeholder="Написать сообщение..." 
                  className="flex-1 bg-muted border-border rounded-xl"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  size="icon" 
                  className="rounded-xl gold-gradient text-black"
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                >
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-3xl gold-gradient flex items-center justify-center shadow-2xl">
                <img 
                  src="https://cdn.poehali.dev/projects/b5ad7d7a-57ef-47f6-88e3-7980384538e9/files/e609de3a-c1c4-4509-af42-53a7aba81515.jpg" 
                  alt="WOLF" 
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h2 className="text-3xl font-bold text-shadow-gold">WOLF</h2>
              <p className="text-muted-foreground max-w-md">
                Выберите чат для начала общения или создайте новый
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground pt-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Оффлайн режим активен</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;