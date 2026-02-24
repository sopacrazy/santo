import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  image: string;
  zIndex: number;
  type?: 'burger' | 'drink' | 'base';
}

// O zIndex define a ordem da pilha. Valores maiores ficam por cima de tudo (visualmente).
export const AVAILABLE_INGREDIENTS: Ingredient[] = [
  { id: 'lettuce', name: 'Alface', price: 1.0, image: '/lettuce.png', zIndex: 60, type: 'burger' },
  { id: 'tomato', name: 'Tomate', price: 1.5, image: '/tomato.png', zIndex: 50, type: 'burger' },
  { id: 'pineapple', name: 'Abacaxi Assado', price: 2.0, image: '/pineapple.png', zIndex: 45, type: 'burger' },
  { id: 'sauce', name: 'Molho Especial', price: 2.0, image: '/sauce.png', zIndex: 40, type: 'burger' },
  { id: 'bacon', name: 'Bacon', price: 3.5, image: '/bacon.png', zIndex: 30, type: 'burger' },
  { id: 'cheese', name: 'Queijo Cheddar', price: 2.5, image: '/cheese.png', zIndex: 20, type: 'burger' },
  { id: 'base_burger', name: 'Hambúrguer Clássico', price: 17.0, image: '/hamburgue.png', zIndex: 10, type: 'base' },
  { id: 'coke', name: 'Coca-Cola 350ml', price: 6.0, image: '/coke.png', zIndex: 0, type: 'drink' },
  { id: 'guarana', name: 'Guaraná 350ml', price: 5.5, image: '/guarana.png', zIndex: 0, type: 'drink' },
  { id: 'orange_juice', name: 'Suco de Laranja', price: 8.0, image: '/orange_juice.png', zIndex: 0, type: 'drink' },
];

export const BASE_PRICE = 0.0;

export interface SelectedIngredient {
  uniqueId: string;
  ingredient: Ingredient;
}

const initialStack: SelectedIngredient[] = [
  { uniqueId: 'init-base', ingredient: AVAILABLE_INGREDIENTS.find(i => i.id === 'base_burger')! },
];

export interface BurgerBuilderProps {
  onCheckout: (items: SelectedIngredient[], total: number) => void;
}

export default function BurgerBuilder({ onCheckout }: BurgerBuilderProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>(initialStack);
  const [activeTab, setActiveTab] = useState<'burger' | 'drink'>('burger');

  const addIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients((prev) => [
      ...prev,
      { uniqueId: Math.random().toString(36).substring(7), ingredient }
    ]);
  };

  const removeIngredient = (uniqueId: string) => {
    setSelectedIngredients((prev) => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const totalPrice = useMemo(() => {
    return BASE_PRICE + selectedIngredients.reduce((sum, item) => sum + item.ingredient.price, 0);
  }, [selectedIngredients]);

  const itemsToShow = AVAILABLE_INGREDIENTS.filter(ing => (ing.type || 'burger') === activeTab);

  return (
    <div className="flex flex-col h-full bg-white relative w-full pt-16">
      
      {/* Imagem do Burger Estático */}
      <div className="flex-1 relative flex flex-col items-center justify-center -mt-10 overflow-hidden min-h-[300px]">
        <motion.div 
          className="relative flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <img src="/hamburgue.png" alt="Hambúrguer Montado" className="w-64 drop-shadow-2xl object-contain z-10" onError={(e) => { e.currentTarget.src = '/hamburguer.png'; }} />
          <div className="w-48 h-8 bg-black/10 blur-xl rounded-[100%] absolute bottom-2 z-0" />
        </motion.div>
      </div>

      {/* Painel de Controle - Componente Flexível com Scroll */}
      <div className="bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] px-6 pt-8 pb-8 flex flex-col min-h-[50vh] flex-1 z-30 relative">
        <div className="flex justify-between items-end mb-4">
           <div>
             <h2 className="text-xl font-bold text-slate-800">Detalhes do Pedido</h2>
             <p className="text-slate-400 text-sm">Personalize com adicionais</p>
           </div>
           
           <motion.div 
             key={totalPrice} // Anima o preço ao mudar
             initial={{ scale: 1.2, color: '#f97316' }}
             animate={{ scale: 1, color: '#1e293b' }}
             className="text-2xl font-bold text-slate-800"
           >
             R$ {totalPrice.toFixed(2)}
           </motion.div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex gap-4 mb-4 border-b border-slate-100 pb-2 relative z-40">
          <button 
            onClick={() => setActiveTab('burger')}
            className={`font-bold transition-colors pb-2 ${activeTab === 'burger' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'}`}
          >
            Ingredientes
          </button>
          <button 
            onClick={() => setActiveTab('drink')}
            className={`font-bold transition-colors pb-2 ${activeTab === 'drink' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-400'}`}
          >
            Sucos / Refri
          </button>
        </div>

        {/* Lista de Ingredientes com Scroll Interno */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-4 relative z-40">
          {itemsToShow.map(ing => {
            const currentItemDocs = selectedIngredients.filter(item => item.ingredient.id === ing.id);
            const count = currentItemDocs.length;
            
            return (
              <div key={ing.id} className="flex items-center justify-between bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center p-2 border border-slate-50">
                    <img src={ing.image} alt={ing.name} className="w-full h-full object-contain" onError={e => e.currentTarget.style.display = 'none'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-700 text-sm">{ing.name}</h3>
                    <span className="text-orange-500 font-bold text-[11px] uppercase tracking-wider">+ R$ {ing.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-2xl shadow-sm border border-slate-50">
                  <button 
                    onClick={() => {
                      // Remove o último ingrediente adicionado deste tipo
                      const lastItem = [...selectedIngredients].reverse().find(i => i.ingredient.id === ing.id);
                      if (lastItem) removeIngredient(lastItem.uniqueId);
                    }}
                    disabled={count === 0}
                    className={`p-1.5 rounded-xl transition-colors ${count > 0 ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-200'}`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-slate-700 w-4 text-center text-sm">{count}</span>
                  <button 
                    onClick={() => addIngredient(ing)}
                    className="p-1.5 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button 
          onClick={() => onCheckout(selectedIngredients, totalPrice)}
          className="w-full mt-2 bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-800/20 active:scale-95 transition-transform flex items-center justify-center"
        >
          Concluir Pedido
        </button>
      </div>
    </div>
  );
}
