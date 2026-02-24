/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  Search,
  LayoutGrid,
  SlidersHorizontal,
  Home,
  MapPin,
  ShoppingBag,
  User,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BurgerBuilder, { AVAILABLE_INGREDIENTS, SelectedIngredient, Ingredient } from './components/BurgerBuilder';

type Screen = 'home' | 'details' | 'checkout' | 'sobre';

export interface CartItemType {
  id: string;
  type: 'burger' | 'drink';
  name: string;
  price: number;
  image: string;
  quantity: number;
  extras?: SelectedIngredient[];
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [activeCategory, setActiveCategory] = useState<'Hambúrguer' | 'Bebidas'>('Hambúrguer');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSendWhatsApp = () => {
    if (!customerName) return;
    
    let text = `*Novo Pedido - Santto Hambúrguer*\n`;
    text += `*Cliente:* ${customerName}\n\n`;
    text += `*Itens do Pedido:*\n`;
    
    cartItems.forEach(item => {
      text += `- ${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})\n`;
      if (item.extras && item.extras.length > 0) {
        // Find extras except the base_burger
        const extrasOnly = item.extras.filter(e => e.ingredient.type !== 'base');
        if (extrasOnly.length > 0) {
          const extrasText = extrasOnly.map(e => e.ingredient.name).join(', ');
          text += `  * + Adicionais: ${extrasText}\n`;
        }
      }
    });
    
    text += `\n*Forma de Pagamento:* ${paymentMethod || 'A combinar'}\n`;
    text += `*Total:* R$ ${cartTotal.toFixed(2)}`;
    
    const encodedText = encodeURIComponent(text);
    // Abre o link do WhatsApp
    window.open(`https://wa.me/5591984497134?text=${encodedText}`, '_blank');
  };

  const addBurgerToCart = (ingredients: SelectedIngredient[], total: number) => {
    setCartItems(prev => [...prev, {
      id: Math.random().toString(),
      type: 'burger',
      name: 'Hambúrguer Personalizado',
      price: total,
      image: '/hamburgue.png',
      quantity: 1,
      extras: ingredients
    }]);
    setCurrentScreen('home');
  };

  const addDrinkToCart = (drink: Ingredient) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.name === drink.name && i.type === 'drink');
      if (existing) {
        return prev.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: Math.random().toString(),
        type: 'drink',
        name: drink.name,
        price: drink.price,
        image: drink.image,
        quantity: 1
      }];
    });
  };

  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const categories = [
    { name: 'Hambúrguer', icon: '🍔' },
    { name: 'Bebidas', icon: '🥤' }
  ];

  const recommended = [
    { name: 'Clássico', price: 'R$ 15,50', image: '/hamburgue.png' },
    { name: 'Bacon Smash', price: 'R$ 19,99', image: '/hamburgue.png' },
    { name: 'Monster Burguer', price: 'R$ 25,90', image: '/hamburgue.png' },
    { name: 'Cebola Crispy', price: 'R$ 22,50', image: '/hamburgue.png' },
  ];

  const ingredients = [
    { name: 'Carne', icon: '🥩', color: 'bg-[#d1fae5]' },
    { name: 'Tomate', icon: '🍅', color: 'bg-[#e0e7ff]' },
    { name: 'Pimenta', icon: '🌶️', color: 'bg-[#dcfce7]' },
    { name: 'Cebola', icon: '🧅', color: 'bg-[#fce7f3]' },
  ];

  return (
    <div className="h-screen w-full bg-slate-50 font-sans overflow-hidden relative flex flex-col">

      <AnimatePresence mode="wait">
        {currentScreen === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-full absolute inset-0 bg-white flex flex-col z-10"
          >
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
              {/* Cabeçalho Home */}
              <div className="px-8 pt-12 mb-2 flex items-center gap-4">
                <img src="/logo.png" alt="Santto Logo" className="w-20 h-20 object-cover shadow-sm rounded-full" />
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black text-slate-500 tracking-tight leading-tight">Santto</h1>
                  <h2 className="text-4xl font-black text-orange-500 tracking-tight leading-none overflow-visible pb-1">Hambúrguer</h2>
                </div>
              </div>

              {/* Busca */}
              <div className="px-8 mt-8 flex gap-3">
                <div className="flex-1 bg-slate-50 rounded-2xl flex items-center px-4 gap-3 border border-slate-100">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Buscar" className="bg-transparent border-none outline-none py-4 text-sm w-full" />
                </div>
              </div>

              {/* Categorias */}
              <div className="mt-10">
                <h3 className="px-8 text-xl font-bold text-slate-800 mb-6">Categorias</h3>
                <div className="px-8 flex gap-4 overflow-x-auto no-scrollbar pb-4">
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat.name;
                    return (
                      <div key={cat.name} onClick={() => setActiveCategory(cat.name as any)} className="flex flex-col items-center gap-3 cursor-pointer">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-orange-500' : 'text-slate-600'}`}>{cat.name}</span>
                        <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center p-2 transition-colors ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 text-slate-400'}`}>
                          <div className={`p-2 rounded-full text-3xl ${isActive ? '' : 'grayscale opacity-60'}`}>{cat.icon}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recomendados / Bebidas */}
              <div className="mt-6 px-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">{activeCategory === 'Hambúrguer' ? 'Recomendados' : 'Opções de Bebidas'}</h3>
                
                {activeCategory === 'Hambúrguer' && (
                  <div className="grid grid-cols-2 gap-4">
                    {recommended.map((item) => (
                      <motion.div 
                        key={item.name}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentScreen('details')}
                        className="bg-slate-50 rounded-[2.5rem] p-4 flex flex-col items-center relative cursor-pointer group"
                      >
                        <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-2xl mb-4 group-hover:scale-110 transition-transform" />
                        <div className="w-full space-y-1">
                          <h4 className="font-bold text-slate-800 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">A partir de</p>
                          <div className="flex justify-between items-center">
                            <span className="text-orange-500 font-bold text-sm">{item.price}</span>
                            <div className="bg-slate-200 w-6 h-6 rounded-lg flex items-center justify-center text-slate-600">
                              <Plus className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeCategory === 'Bebidas' && (
                  <div className="flex flex-col gap-4">
                    {AVAILABLE_INGREDIENTS.filter(i => i.type === 'drink').map(drink => (
                       <div key={drink.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                              <img src={drink.image} alt={drink.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{drink.name}</h4>
                              <span className="text-orange-500 font-bold text-sm">R$ {drink.price.toFixed(2)}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => addDrinkToCart(drink)}
                            className="bg-orange-50 p-3 rounded-xl text-orange-500 hover:bg-orange-100 transition-colors"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                       </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navegação Inferior Atualizada */}
            <div className="absolute bottom-0 left-0 right-0 bg-white px-8 py-5 flex justify-between items-center border-t border-slate-50 shadow-2xl z-[100]">
              <div 
                onClick={() => { setCurrentScreen('home'); setActiveCategory('Hambúrguer'); }}
                className={`cursor-pointer w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${currentScreen === 'home' && activeCategory === 'Hambúrguer' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400'}`}
              >
                <Home className="w-6 h-6" />
              </div>
              
              <div 
                onClick={() => { setCurrentScreen('home'); setActiveCategory('Hambúrguer'); }}
                className={`cursor-pointer w-12 h-12 flex items-center justify-center rounded-2xl transition-all text-slate-400`}
              >
                <div className="text-2xl">🍔</div>
              </div>

              <div 
                onClick={() => setCurrentScreen('checkout')}
                className={`cursor-pointer w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative ${currentScreen === 'checkout' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400'}`}
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">{cartItems.length}</span>
                )}
              </div>

              <div 
                onClick={() => setCurrentScreen('sobre')}
                className={`cursor-pointer w-12 h-12 flex items-center justify-center rounded-2xl transition-all relative ${currentScreen === 'sobre' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-400'}`}
              >
                <Info className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ) : currentScreen === 'details' ? (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="w-full h-full absolute inset-0 bg-white flex flex-col z-20"
          >
            {/* Botão Voltar Absoluto */}
            <div className="absolute top-0 left-0 w-full px-8 pt-10 pb-4 flex items-center justify-between z-[500]">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-sm hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>
            </div>

            <BurgerBuilder onCheckout={addBurgerToCart} />
          </motion.div>
        ) : currentScreen === 'checkout' ? (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="w-full h-full absolute inset-0 bg-white flex flex-col z-30"
          >
            {/* Header Checkout */}
            <div className="px-8 pt-10 pb-4 flex items-center justify-between border-b border-slate-50">
              <button 
                onClick={() => setCurrentScreen('details')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>
              <h2 className="text-xl font-bold text-slate-800">Seu Pedido</h2>
              <div className="w-10"></div>
            </div>

            {/* Checkout content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-slate-50">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 text-lg">Resumo</h3>
                <div className="space-y-4">
                  {/* Exibir itens reais do carrinho */}
                  {cartItems.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">Seu carrinho está vazio.</p>
                  ) : (
                    cartItems.map(item => {
                      const icon = item.type === 'drink' ? '🥤' : '🍔';
                      
                      return (
                        <div key={item.id} className="flex justify-between items-start gap-3 bg-white border border-slate-50 p-4 rounded-2xl shadow-sm">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 flex items-center justify-center p-1.5 bg-slate-50 rounded-xl">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-slate-800 font-bold">{item.quantity}x {item.name}</span>
                              <span className="text-orange-500 font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</span>
                              
                              {/* Sublista de extras */}
                              {item.extras && item.extras.length > 0 && (
                                <ul className="mt-1 text-slate-500 text-[11px] space-y-0.5">
                                  {item.extras.filter(e => e.ingredient.type !== 'base').map(extra => (
                                    <li key={extra.uniqueId}>+ {extra.ingredient.name}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="border-t border-slate-100 mt-6 pt-6 flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Total a pagar</span>
                  <span className="text-2xl font-bold text-orange-500">R$ {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4 text-lg">Seus Dados</h3>
                 <input 
                   type="text" 
                   placeholder="Seu nome completo" 
                   value={customerName}
                   onChange={(e) => setCustomerName(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium text-slate-700"
                 />
              </div>
              
              <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4 text-lg">Pagamento</h3>
                 <div className="space-y-3">
                   {['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'].map(method => (
                     <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === method ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-orange-500' : 'border-slate-300'}`}>
                         {paymentMethod === method && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                       </div>
                       <input 
                         type="radio" 
                         name="payment" 
                         value={method}
                         checked={paymentMethod === method}
                         onChange={(e) => setPaymentMethod(e.target.value)}
                         className="hidden"
                       />
                       <span className={`font-medium ${paymentMethod === method ? 'text-orange-700' : 'text-slate-700'}`}>{method}</span>
                     </label>
                   ))}
                 </div>
              </div>
            </div>

            {/* Checkout Footer */}
            <div className="p-6 bg-white border-t border-slate-100">
               <button 
                 disabled={!customerName}
                 onClick={handleSendWhatsApp}
                 className={`w-full font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center text-lg ${customerName ? 'bg-orange-500 text-white shadow-orange-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
               >
                 Enviar Pedido
               </button>
            </div>
          </motion.div>
        ) : currentScreen === 'sobre' ? (
          <motion.div 
            key="sobre"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="w-full h-full absolute inset-0 bg-white flex flex-col z-30"
          >
            {/* Header Sobre */}
            <div className="px-8 pt-10 pb-4 flex items-center justify-between border-b border-slate-50">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>
              <h2 className="text-xl font-bold text-slate-800">Sobre nós</h2>
              <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
              <div className="flex justify-center mb-8">
                <img src="/logo.png" alt="Santto Hambúrguer" className="w-32 h-32 object-contain" />
              </div>
              
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Santto Hambúrguer</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Tradição e qualidade desde que começamos. Nossos hambúrgueres artesanais são feitos com os melhores ingredientes locais para garantir um sabor inesquecível.
                </p>
                <div className="pt-4 space-y-3 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">Rua Principal, 123 - Centro</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
