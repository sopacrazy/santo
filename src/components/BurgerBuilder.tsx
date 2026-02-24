import { useState, useMemo, useEffect } from 'react';
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
  key?: string;
  onCheckout: (items: SelectedIngredient[], total: number) => void;
  selectedBurger?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

export default function BurgerBuilder({ onCheckout, selectedBurger }: BurgerBuilderProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>(() => {
    if (selectedBurger) {
      return [{ uniqueId: `init-${selectedBurger.id}`, ingredient: { id: selectedBurger.id, name: selectedBurger.name, price: selectedBurger.price, image: selectedBurger.image, zIndex: 10, type: 'base' } as Ingredient }];
    }
    return initialStack;
  });

  const [animFrame, setAnimFrame] = useState(1);

  useEffect(() => {
    if (selectedBurger?.id === 'classico') {
      const interval = setInterval(() => {
        setAnimFrame(prev => {
          if (prev >= 6) {
            clearInterval(interval);
            return 6;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [selectedBurger?.id]);

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

  const itemsToShow = AVAILABLE_INGREDIENTS.filter(ing => ing.type === 'burger');

  return (
    <div className="flex flex-col h-full bg-white relative w-full pt-16">
      
      {/* Imagem do Burger Estático */}
      <div className="flex-1 relative flex flex-col items-center justify-center -mt-10 overflow-hidden min-h-[300px]">
        <motion.div 
          className="relative flex flex-col items-center justify-center w-64 h-64"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedBurger?.id === 'classico' ? (
            <div className="w-full h-full relative flex items-center justify-center z-10">
              <AnimatePresence>
                <motion.img 
                  key={animFrame}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={`/${animFrame}.png`}
                  alt="Montando Hambúrguer" 
                  className="w-full h-full drop-shadow-2xl object-contain absolute inset-0" 
                />
              </AnimatePresence>
            </div>
          ) : (
            <img 
              src={selectedBurger?.image || '/hamburgue.png'} 
              alt="Hambúrguer Montado" 
              className="w-full h-full drop-shadow-2xl object-contain z-10" 
              onError={(e) => { e.currentTarget.src = '/hamburguer.png'; }} 
            />
          )}
          <div className="w-48 h-8 bg-black/10 blur-xl rounded-[100%] absolute -bottom-4 z-0" />
        </motion.div>
      </div>

      {/* Painel de Controle - Componente Flexível com Scroll */}
      <div className="bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] px-6 pt-8 pb-8 flex flex-col min-h-[50vh] flex-1 z-30 relative">
        <div className="flex justify-between items-start mb-4">
           <div className="flex-1 pr-4">
             <h2 className="text-2xl font-black text-slate-800 leading-tight">{selectedBurger ? selectedBurger.name : 'Detalhes do Pedido'}</h2>
             <p className="text-slate-500 text-sm mt-1 leading-relaxed">{selectedBurger ? selectedBurger.description : 'Personalize com adicionais'}</p>
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
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
