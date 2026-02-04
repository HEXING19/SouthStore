import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User, 
  MessageCircle, 
  Send, 
  Star, 
  Plus, 
  Minus, 
  Trash2,
  Store,
  Zap,
  Hammer
} from 'lucide-react';
import { Product, CartItem, ViewState, ChatMessage } from './types';
import { PRODUCTS, CATEGORIES, CURRENCY_SYMBOL } from './constants';
import { sendMessageToGemini } from './services/geminiService';

// --- Components ---

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

interface ButtonProps { 
  onClick?: () => void; 
  children?: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'; 
  className?: string;
  disabled?: boolean;
}

const Button = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false 
}: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main App ---

export default function App() {
  // State
  const [view, setView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Howzit! I\'m Thandi. Looking for work boots, solar lights, or maybe something nice to wear? Ask me anything!', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derived State
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  // Handlers
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && view !== 'SHOP') {
      setView('SHOP');
      setSelectedCategory('All');
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: new Date() };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Render Functions ---

  const renderHeader = () => (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => setView('HOME')}>
              <Store className="h-8 w-8 text-indigo-600 mr-2" />
              <span className="font-bold text-xl text-gray-900">SouthStore</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => { setView('HOME'); setSelectedCategory('All'); }}
                className={`text-sm font-medium ${view === 'HOME' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Home
              </button>
              <button 
                onClick={() => { setView('SHOP'); setSelectedCategory('Clothing'); }}
                className={`text-sm font-medium ${selectedCategory === 'Clothing' && view === 'SHOP' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Clothing
              </button>
              <button 
                onClick={() => { setView('SHOP'); setSelectedCategory('Hardware'); }}
                className={`text-sm font-medium ${selectedCategory === 'Hardware' && view === 'SHOP' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Hardware
              </button>
              <button 
                onClick={() => { setView('SHOP'); setSelectedCategory('All'); }}
                className={`text-sm font-medium ${view === 'SHOP' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Shop All
              </button>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`p-2 rounded-full hover:bg-gray-100 ${isSearchOpen ? 'text-indigo-600 bg-gray-50' : 'text-gray-400 hover:text-gray-500'}`}
              >
                <Search className="h-6 w-6" />
              </button>

              <button 
                onClick={() => { setIsLoginOpen(true); setAuthMode('signin'); }}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full" 
                title="Login"
              >
                <User className="h-6 w-6" />
              </button>

              <div className="relative">
                <button onClick={() => setIsCartOpen(true)} className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-gray-100 bg-white py-4 animate-in slide-in-from-top-2 fade-in-20 duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button 
                onClick={() => { setView('HOME'); setIsMobileMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => { setView('SHOP'); setSelectedCategory('Clothing'); setIsMobileMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Clothing
              </button>
              <button 
                onClick={() => { setView('SHOP'); setSelectedCategory('Hardware'); setIsMobileMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Hardware
              </button>
              <button 
                onClick={() => { setView('SHOP'); setSelectedCategory('All'); setIsMobileMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left"
              >
                Shop All
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );

  const renderHero = () => (
    <div className="relative bg-indigo-900">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-30"
          src="https://picsum.photos/1920/600?grayscale"
          alt="Warehouse"
        />
        <div className="absolute inset-0 bg-indigo-900 mix-blend-multiply" aria-hidden="true" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Everything You Need,<br/>From Joburg to Cape Town
        </h1>
        <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
          Quality hardware for the job site and stylish clothing for the weekend. Fast delivery nationwide.
        </p>
        <div className="mt-10">
          <Button variant="secondary" onClick={() => { setView('SHOP'); setSelectedCategory('All'); }} className="px-8 py-4 text-lg">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProductGrid = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory}`}
        </h2>
        
        {/* Filters */}
        <div className="mt-4 md:mt-0 flex space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setView('SHOP'); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 group-hover:opacity-90 h-64 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-center object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm font-medium text-indigo-600">
                    {CURRENCY_SYMBOL}{product.price}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="mt-2 flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-1 text-xs text-gray-500">({product.rating})</span>
                </div>
              </div>
              <Button 
                onClick={() => addToCart(product)} 
                className="mt-4 w-full flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found for your search.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear Search</Button>
        </div>
      )}
    </div>
  );

  const renderCartDrawer = () => (
    <div className={`fixed inset-0 overflow-hidden z-[60] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className="absolute inset-0 overflow-hidden">
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsCartOpen(false)}
        />
        
        <div className={`fixed inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-500 sm:duration-700 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button onClick={() => setIsCartOpen(false)} className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  {cart.length === 0 ? (
                    <div className="text-center py-10">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-2 text-gray-500">Your cart is empty.</p>
                      <Button variant="secondary" className="mt-4" onClick={() => setIsCartOpen(false)}>Start Shopping</Button>
                    </div>
                  ) : (
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.id} className="py-6 flex">
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">{CURRENCY_SYMBOL}{item.price * item.quantity}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex-1 flex items-end justify-between text-sm">
                              <div className="flex items-center border rounded-md">
                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100"><Minus className="h-4 w-4" /></button>
                                <span className="px-2">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100"><Plus className="h-4 w-4" /></button>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => removeFromCart(item.id)}
                                className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{CURRENCY_SYMBOL}{cartTotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <Button className="w-full flex justify-center items-center py-3 text-lg" variant="secondary">
                      Checkout
                    </Button>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                    <p>
                      or{' '}
                      <button onClick={() => setIsCartOpen(false)} className="text-indigo-600 font-medium hover:text-indigo-500">
                        Continue Shopping<span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoginModal = () => {
    if (!isLoginOpen) return null;

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setIsLoginOpen(false)}
        />

        {/* Modal Panel */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto p-6 animate-in fade-in zoom-in duration-200">
          <button 
            onClick={() => setIsLoginOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {authMode === 'signin' ? 'Sign in to SouthStore' : 'Create an Account'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {authMode === 'signin' ? 'Welcome back! Please enter your details.' : 'Join us to start shopping.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsLoginOpen(false); }}>
            
            {authMode === 'signup' && (
               <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={authMode === 'signin' ? "current-password" : "new-password"}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button className="w-full flex justify-center py-2">
              {authMode === 'signin' ? 'Sign in' : 'Sign up'}
            </Button>
            
            <div className="flex flex-col space-y-2 text-center text-xs text-gray-500 mt-4">
               {authMode === 'signin' ? (
                   <>
                       <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
                       <p className="text-gray-500 mt-2">
                           Don't have an account?{' '}
                           <button 
                               type="button"
                               onClick={() => setAuthMode('signup')}
                               className="font-medium text-indigo-600 hover:text-indigo-500"
                           >
                               Sign up
                           </button>
                       </p>
                   </>
               ) : (
                   <p className="text-gray-500">
                       Already have an account?{' '}
                       <button 
                           type="button"
                           onClick={() => setAuthMode('signin')}
                           className="font-medium text-indigo-600 hover:text-indigo-500"
                       >
                           Sign in
                       </button>
                   </p>
               )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderChatWidget = () => (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isChatOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <Zap className="h-5 w-5 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Thandi AI</h3>
                <p className="text-xs text-indigo-200">Online • Shopping Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex mb-4 justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleChatSubmit} className="p-3 bg-white border-t border-gray-200 flex">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask about tools, clothes..."
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button 
              type="submit" 
              disabled={!chatInput.trim() || isTyping}
              className="ml-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`${isChatOpen ? 'bg-gray-700' : 'bg-indigo-600'} hover:opacity-90 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105`}
      >
        {isChatOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {renderHeader()}
      
      <main>
        {view === 'HOME' && (
          <>
            {renderHero()}
            <div className="bg-white py-12">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center">
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                      Featured Categories
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                      Quality goods curated for the South African lifestyle.
                    </p>
                  </div>

                  <div className="mt-10">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                       {/* Category Cards */}
                       <div 
                        className="cursor-pointer bg-gray-100 rounded-xl overflow-hidden relative group h-64"
                        onClick={() => { setView('SHOP'); setSelectedCategory('Clothing'); }}
                       >
                          <img src="https://picsum.photos/600/400?random=10" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Clothing" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <h3 className="text-white text-3xl font-bold">Clothing</h3>
                          </div>
                       </div>
                       <div 
                        className="cursor-pointer bg-gray-100 rounded-xl overflow-hidden relative group h-64"
                        onClick={() => { setView('SHOP'); setSelectedCategory('Hardware'); }}
                       >
                          <img src="https://picsum.photos/600/400?random=11" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Hardware" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <h3 className="text-white text-3xl font-bold">Hardware</h3>
                          </div>
                       </div>
                       <div 
                        className="cursor-pointer bg-gray-100 rounded-xl overflow-hidden relative group h-64 sm:col-span-2 lg:col-span-1"
                        onClick={() => { setView('SHOP'); setSelectedCategory('Electronics'); }}
                       >
                          <img src="https://picsum.photos/600/400?random=12" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Electronics" />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                            <h3 className="text-white text-3xl font-bold">Load Shedding</h3>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
            {renderProductGrid()}
          </>
        )}
        
        {view === 'SHOP' && renderProductGrid()}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">SouthStore</h3>
            <p className="text-sm">Proudly South African. Providing quality tools and threads since 2024.</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>Contact Us</li>
              <li>Shipping Policy</li>
              <li>Returns</li>
              <li>Track Order</li>
            </ul>
          </div>
          <div>
             <h3 className="text-white text-lg font-bold mb-4">Accepted Payment</h3>
             <div className="flex space-x-2">
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">VISA</div>
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">MC</div>
                <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-xs font-bold text-gray-800">EFT</div>
             </div>
          </div>
        </div>
      </footer>

      {renderCartDrawer()}
      {renderChatWidget()}
      {renderLoginModal()}
    </div>
  );
}