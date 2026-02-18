import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingBag, Gamepad2, CheckCircle, Circle, Coins, Flame, Heart, Save, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

import PetDisplay from './PetDisplay';
import Arcade from './Arcade';
import { Habit, PetStage, ShopItem, UserState, PetState } from '../types';
import { INITIAL_HABITS, INITIAL_SHOP_ITEMS, LEVEL_THRESHOLDS, XP_PER_HABIT, COINS_PER_HABIT } from '../constants';
import { generatePetReaction, generatePetGreeting } from '../services/aiService';

interface GameProps {
  username: string;
  onLogout: () => void;
}

const getPetStage = (xp: number): PetStage => {
  if (xp >= LEVEL_THRESHOLDS[PetStage.MYTHIC]) return PetStage.MYTHIC;
  if (xp >= LEVEL_THRESHOLDS[PetStage.ADULT]) return PetStage.ADULT;
  if (xp >= LEVEL_THRESHOLDS[PetStage.TEEN]) return PetStage.TEEN;
  if (xp >= LEVEL_THRESHOLDS[PetStage.CHILD]) return PetStage.CHILD;
  if (xp >= LEVEL_THRESHOLDS[PetStage.BABY]) return PetStage.BABY;
  return PetStage.EGG;
};

// Helper to get local date string YYYY-MM-DD
const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Game: React.FC<GameProps> = ({ username, onLogout }) => {
  // Helper for user-specific keys
  const getStorageKey = (key: string) => `hh_${username}_${key}`;

  // --- State ---
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'games'>('home');
  const [newHabitName, setNewHabitName] = useState('');
  const [petMessage, setPetMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  
  // Game State
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(getStorageKey('habits'));
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem(getStorageKey('user'));
    return saved ? JSON.parse(saved) : {
      coins: 0,
      gems: 0,
      dayStreak: 0,
      lastLoginDate: getToday(),
      inventory: []
    };
  });

  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem(getStorageKey('pet'));
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      name: 'Hatchy',
      xp: 0,
      level: 1,
      stage: PetStage.EGG,
      hunger: 50,
      happiness: 50,
      equippedHat: null,
      equippedBackground: null,
      equippedSkin: null,
      equippedAccessory: null,
      ...parsed
    };
  });

  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    const saved = localStorage.getItem(getStorageKey('shop'));
    let loadedItems = saved ? JSON.parse(saved) : INITIAL_SHOP_ITEMS;
    
    // Merge any new hardcoded items into the loaded list (migration to new 3d items)
    const loadedIds = new Set(loadedItems.map((i: any) => i.id));
    const newItems = INITIAL_SHOP_ITEMS.filter(i => !loadedIds.has(i.id));
    
    // Also update existing items with new image/data properties if they are missing
    loadedItems = loadedItems.map((item: ShopItem) => {
        const freshItem = INITIAL_SHOP_ITEMS.find(i => i.id === item.id);
        if (freshItem) {
            return { ...item, image: freshItem.image, data: freshItem.data };
        }
        return item;
    });

    return [...loadedItems, ...newItems];
  });

  // --- Automatic Saving ---
  useEffect(() => {
    localStorage.setItem(getStorageKey('habits'), JSON.stringify(habits));
    localStorage.setItem(getStorageKey('user'), JSON.stringify(user));
    localStorage.setItem(getStorageKey('pet'), JSON.stringify(pet));
    localStorage.setItem(getStorageKey('shop'), JSON.stringify(shopItems));
  }, [habits, user, pet, shopItems, username]);

  // --- Daily Reset Logic ---
  useEffect(() => {
    const checkAndReset = () => {
      const today = getToday();
      if (user.lastLoginDate !== today) {
        // Calculate if streak is preserved (must be yesterday)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
        
        const isConsecutive = user.lastLoginDate === yesterdayStr;
        const missedDay = !isConsecutive && user.lastLoginDate !== today; // If not today and not yesterday, we missed a day.

        setUser(prev => ({
          ...prev,
          lastLoginDate: today,
          dayStreak: missedDay ? 0 : prev.dayStreak
        }));

        setHabits(prev => prev.map(h => ({ ...h, completed: false })));

        const timeHour = new Date().getHours();
        const timeOfDay = timeHour < 12 ? 'morning' : timeHour < 18 ? 'afternoon' : 'evening';
        generatePetGreeting(pet.name, pet.stage, timeOfDay).then(msg => {
          setPetMessage(msg);
          setTimeout(() => setPetMessage(null), 5000);
        });
      }
    };

    // Run immediately on mount/update
    checkAndReset();

    // Run on visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndReset();
      }
    };

    // Run on interval (every minute) to catch midnight crossover while open
    const intervalId = setInterval(checkAndReset, 60000);
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user.lastLoginDate, pet.name, pet.stage]);

  // --- Actions ---

  const handleManualSave = () => {
    localStorage.setItem(getStorageKey('habits'), JSON.stringify(habits));
    localStorage.setItem(getStorageKey('user'), JSON.stringify(user));
    localStorage.setItem(getStorageKey('pet'), JSON.stringify(pet));
    localStorage.setItem(getStorageKey('shop'), JSON.stringify(shopItems));
    
    setSaveStatus("Saved!");
    setTimeout(() => setSaveStatus(null), 2000);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName,
      completed: false,
      streak: 0
    };
    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const removeHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find(h => h.id === id);
    if (!habit || habit.completed) return; 

    setHabits(prev => prev.map(h => h.id === id ? { ...h, completed: true, streak: h.streak + 1 } : h));

    setUser(prev => {
        const isFirstHabitToday = habits.every(h => !h.completed);
        let newStreak = prev.dayStreak;
        if (isFirstHabitToday) {
            newStreak += 1;
        }

        return {
            ...prev,
            coins: prev.coins + COINS_PER_HABIT,
            dayStreak: newStreak
        };
    });

    setPet(prev => {
      const newXp = prev.xp + XP_PER_HABIT;
      const newStage = getPetStage(newXp);
      const leveledUp = newStage !== prev.stage;
      
      if (leveledUp) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF4500']
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        stage: newStage,
        happiness: Math.min(prev.happiness + 5, 100)
      };
    });

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
    });
    
    const reaction = await generatePetReaction(habit.name, pet.name, pet.stage, user.dayStreak);
    setPetMessage(reaction);
    setTimeout(() => setPetMessage(null), 4000);
  };

  const buyItem = (item: ShopItem) => {
    if (user.inventory.includes(item.id)) {
        equipItem(item);
        return;
    }

    if (user.coins < item.price) return;

    setUser(prev => ({
      ...prev,
      coins: prev.coins - item.price,
      inventory: [...prev.inventory, item.id]
    }));

    setShopItems(prev => prev.map(i => i.id === item.id ? { ...i, purchased: true } : i));
    equipItem(item);
  };

  const equipItem = (item: ShopItem) => {
      const val = item.data || item.emoji;

      setPet(prev => {
          const newState = { ...prev };
          if (item.type === 'hat') newState.equippedHat = val;
          if (item.type === 'background') newState.equippedBackground = val;
          if (item.type === 'skin') newState.equippedSkin = val;
          if (item.type === 'accessory') newState.equippedAccessory = val;
          return newState;
      });
  };

  const handleEarnCoins = (amount: number) => {
    setUser(prev => ({ ...prev, coins: prev.coins + amount }));
  };

  // --- Views ---

  const renderHome = () => (
    <div className="space-y-6">
      <PetDisplay 
        pet={pet} 
        message={petMessage} 
        onClick={() => {
            setPetMessage("I love you!");
            setTimeout(() => setPetMessage(null), 2000);
        }} 
      />
      
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 text-amber-500 font-bold">
          <Coins size={20} />
          <span>{user.coins}</span>
        </div>
        <div className="flex items-center space-x-2 text-orange-500 font-bold">
          <Flame size={20} />
          <span>{user.dayStreak} Days</span>
        </div>
        <div className="flex items-center space-x-2 text-pink-500 font-bold">
            <Heart size={20} />
            <span>{pet.happiness}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-800 px-1">Today's Habits</h2>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <button 
            onClick={addHabit}
            className="bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors shadow-md"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="space-y-3 pb-20">
          <AnimatePresence>
            {habits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`flex items-center justify-between p-4 rounded-xl border-b-4 transition-all ${
                  habit.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`transition-colors ${
                      habit.completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-400'
                    }`}
                  >
                    {habit.completed ? <CheckCircle size={28} className="fill-green-100" /> : <Circle size={28} />}
                  </button>
                  <span className={`font-medium text-lg ${habit.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {habit.name}
                  </span>
                </div>
                
                <button 
                  onClick={() => removeHabit(habit.id)}
                  className="text-gray-300 hover:text-red-400 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {habits.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No habits yet. Start hatching!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderShop = () => (
    <div className="space-y-6 pb-20">
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Item Shop</h2>
            <p className="text-gray-500">Customize your pet!</p>
            <div className="mt-4 inline-flex items-center bg-amber-100 px-4 py-1 rounded-full text-amber-600 font-bold">
                <Coins size={16} className="mr-2" /> {user.coins} Coins
            </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
            {shopItems.map(item => {
                const canAfford = user.coins >= item.price;
                const isOwned = user.inventory.includes(item.id);
                const equippedVal = item.data || item.emoji;
                
                // Check if equipped
                const isEquipped = 
                    (item.type === 'hat' && pet.equippedHat === equippedVal) ||
                    (item.type === 'background' && pet.equippedBackground === equippedVal) ||
                    (item.type === 'skin' && pet.equippedSkin === equippedVal) ||
                    (item.type === 'accessory' && pet.equippedAccessory === equippedVal);

                return (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center relative transition-transform hover:scale-105">
                        {isOwned && (
                             <div className="absolute top-2 right-2 text-green-500 bg-green-50 rounded-full p-1">
                                <CheckCircle size={16} />
                             </div>
                        )}
                        <div className="mb-4 p-2 bg-gray-50 rounded-2xl w-24 h-24 flex items-center justify-center">
                            {item.image ? (
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-contain drop-shadow-md" />
                            ) : (
                                <span className="text-5xl">{item.emoji}</span>
                            )}
                        </div>
                        <h3 className="font-bold text-gray-700 text-sm text-center">{item.name}</h3>
                        <p className="text-xs text-gray-400 mb-2 capitalize">{item.type}</p>
                        
                        <button
                            onClick={() => buyItem(item)}
                            disabled={isOwned && isEquipped}
                            className={`mt-auto w-full py-2 rounded-lg font-bold text-sm transition-all ${
                                isEquipped
                                    ? 'bg-green-100 text-green-600 border border-green-200 cursor-default'
                                    : isOwned 
                                        ? 'bg-blue-50 text-blue-500 hover:bg-blue-100'
                                        : canAfford 
                                            ? 'bg-amber-400 text-white shadow-md hover:bg-amber-500 active:scale-95' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isEquipped ? 'Equipped' : isOwned ? 'Equip' : `${item.price} Coins`}
                        </button>
                    </div>
                )
            })}
       </div>
    </div>
  );

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gray-50 flex flex-col relative shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-white p-6 pb-4 pt-8 sticky top-0 z-30 shadow-sm flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center">
                    HabitHatch <span className="text-2xl ml-2">🥚</span>
                </h1>
                <p className="text-sm text-gray-500 font-medium">Player: <span className="font-bold text-indigo-500">{username}</span></p>
            </div>
            <div className="flex gap-2">
                {saveStatus && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"
                    >
                        {saveStatus}
                    </motion.div>
                )}
                <button 
                    onClick={handleManualSave}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-100 hover:text-indigo-800 transition-colors shadow-sm active:scale-95"
                    title="Force Save"
                >
                    <Save size={20} />
                </button>
                <button 
                    onClick={onLogout}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 hover:text-red-700 transition-colors shadow-sm active:scale-95"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'home' && renderHome()}
            {activeTab === 'shop' && renderShop()}
            {activeTab === 'games' && <Arcade onEarnCoins={handleEarnCoins} petName={pet.name} />}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-100 p-2 pb-6 px-6 flex justify-around items-center sticky bottom-0 z-40">
            <button 
                onClick={() => setActiveTab('home')}
                className={`p-3 rounded-2xl flex flex-col items-center transition-all ${activeTab === 'home' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-indigo-400'}`}
            >
                <CheckCircle size={24} strokeWidth={activeTab === 'home' ? 3 : 2} />
                <span className="text-xs font-bold mt-1">Habits</span>
            </button>
            
            <button 
                onClick={() => setActiveTab('shop')}
                className={`p-3 rounded-2xl flex flex-col items-center transition-all ${activeTab === 'shop' ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-400'}`}
            >
                <ShoppingBag size={24} strokeWidth={activeTab === 'shop' ? 3 : 2} />
                <span className="text-xs font-bold mt-1">Shop</span>
            </button>

            <button 
                onClick={() => setActiveTab('games')}
                className={`p-3 rounded-2xl flex flex-col items-center transition-all ${activeTab === 'games' ? 'text-pink-500 bg-pink-50' : 'text-gray-400 hover:text-pink-400'}`}
            >
                <Gamepad2 size={24} strokeWidth={activeTab === 'games' ? 3 : 2} />
                <span className="text-xs font-bold mt-1">Play</span>
            </button>
        </div>
    </div>
  );
};

export default Game;