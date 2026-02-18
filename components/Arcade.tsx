import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Timer, Hand, Brain, Coins, ArrowLeft, MousePointer2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArcadeProps {
  onEarnCoins: (amount: number) => void;
  petName: string;
}

type GameType = 'menu' | 'rps' | 'memory' | 'clicker';

const Arcade: React.FC<ArcadeProps> = ({ onEarnCoins, petName }) => {
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  const backToMenu = () => setActiveGame('menu');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative">
        {activeGame !== 'menu' && (
          <button 
            onClick={backToMenu}
            className="absolute left-4 top-6 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft size={24} />
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-800">
            {activeGame === 'menu' ? 'Arcade' : activeGame === 'rps' ? 'Rock Paper Scissors' : activeGame === 'memory' ? 'Memory Match' : 'Tap Blitz'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
            {activeGame === 'menu' ? `Play games with ${petName} to earn coins!` : 'Good luck!'}
        </p>
      </div>

      <AnimatePresence mode='wait'>
        {activeGame === 'menu' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 gap-4"
          >
             <GameCard 
                title="Rock Paper Scissors" 
                icon={<Hand size={32} />} 
                color="from-blue-400 to-blue-600"
                onClick={() => setActiveGame('rps')}
                reward="Up to 20"
             />
             <GameCard 
                title="Memory Match" 
                icon={<Brain size={32} />} 
                color="from-purple-400 to-purple-600"
                onClick={() => setActiveGame('memory')}
                reward="30 Coins"
             />
             <GameCard 
                title="Tap Blitz" 
                icon={<MousePointer2 size={32} />} 
                color="from-orange-400 to-red-500"
                onClick={() => setActiveGame('clicker')}
                reward="Variable"
             />
          </motion.div>
        )}

        {activeGame === 'rps' && <RPSGame onEarnCoins={onEarnCoins} />}
        {activeGame === 'memory' && <MemoryGame onEarnCoins={onEarnCoins} onExit={backToMenu} />}
        {activeGame === 'clicker' && <ClickerGame onEarnCoins={onEarnCoins} />}
      </AnimatePresence>
    </div>
  );
};

const GameCard = ({ title, icon, color, onClick, reward }: any) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full p-6 rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg flex items-center justify-between group`}
    >
        <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">{icon}</div>
            <div className="text-left">
                <h3 className="font-bold text-lg">{title}</h3>
                <span className="text-xs bg-black/20 px-2 py-1 rounded-full flex items-center w-fit mt-1">
                    <Coins size={10} className="mr-1" /> {reward}
                </span>
            </div>
        </div>
        <div className="bg-white/20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Gamepad2 size={20} />
        </div>
    </motion.button>
);

// --- Mini Games ---

// 1. Rock Paper Scissors
const RPSGame = ({ onEarnCoins }: { onEarnCoins: (n: number) => void }) => {
    const [result, setResult] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const play = (choice: 'rock' | 'paper' | 'scissors') => {
        if (isAnimating) return;
        setIsAnimating(true);
        setResult(null);

        // Simple delay for suspense
        setTimeout(() => {
            const choices = ['rock', 'paper', 'scissors'] as const;
            const aiChoice = choices[Math.floor(Math.random() * choices.length)];
            
            let msg = '';
            let coins = 0;

            if (choice === aiChoice) {
                msg = `Draw! Both picked ${aiChoice}.`;
                coins = 2;
            } else if (
                (choice === 'rock' && aiChoice === 'scissors') ||
                (choice === 'paper' && aiChoice === 'rock') ||
                (choice === 'scissors' && aiChoice === 'paper')
            ) {
                msg = `Win! ${choice} beats ${aiChoice}.`;
                coins = 20;
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
            } else {
                msg = `Lost! ${aiChoice} beats ${choice}.`;
                coins = 1;
            }

            setResult(msg);
            onEarnCoins(coins);
            setIsAnimating(false);
        }, 600);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center border-4 border-blue-100"
        >
            <div className="h-24 flex items-center justify-center mb-4">
                {result ? (
                    <p className="text-xl font-bold text-indigo-600 animate-pulse">{result}</p>
                ) : (
                    <p className="text-gray-400">{isAnimating ? "Thinking..." : "Choose your weapon!"}</p>
                )}
            </div>
            
            <div className="flex justify-center gap-4">
                {(['rock', 'paper', 'scissors'] as const).map(c => (
                    <button
                        key={c}
                        onClick={() => play(c)}
                        disabled={isAnimating}
                        className="text-4xl bg-gray-50 hover:bg-blue-50 p-6 rounded-2xl border-b-4 border-gray-200 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
                    >
                        {c === 'rock' ? '🪨' : c === 'paper' ? '📄' : '✂️'}
                    </button>
                ))}
            </div>
        </motion.div>
    );
};

// 2. Memory Match
const MemoryGame = ({ onEarnCoins, onExit }: { onEarnCoins: (n: number) => void, onExit: () => void }) => {
    const emojis = ['🍎', '🍌', '🍇', '🍊'];
    const [cards, setCards] = useState<any[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matched, setMatched] = useState<number[]>([]);
    const [locked, setLocked] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        const deck = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, id) => ({ id, emoji }));
        setCards(deck);
    }, []);

    useEffect(() => {
        if (flipped.length === 2) {
            setLocked(true);
            const [first, second] = flipped;
            if (cards[first].emoji === cards[second].emoji) {
                setMatched([...matched, first, second]);
                setFlipped([]);
                setLocked(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setLocked(false);
                }, 1000);
            }
        }
    }, [flipped, cards]);

    useEffect(() => {
        if (matched.length === 8 && matched.length > 0) {
            setGameOver(true);
            onEarnCoins(30);
            confetti({ particleCount: 100, spread: 70 });
        }
    }, [matched]);

    const handleFlip = (index: number) => {
        if (locked || flipped.includes(index) || matched.includes(index)) return;
        setFlipped([...flipped, index]);
    };

    if (gameOver) {
        return (
            <div className="text-center py-10 bg-white rounded-2xl shadow-lg border-4 border-purple-100">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">You Won!</h3>
                <p className="mb-6 text-gray-500">+30 Coins</p>
                <button onClick={onExit} className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-purple-600">
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-2xl border-4 border-purple-50 shadow-lg">
            {cards.map((card, index) => {
                const isFlipped = flipped.includes(index) || matched.includes(index);
                return (
                    <button
                        key={index}
                        onClick={() => handleFlip(index)}
                        className={`aspect-square text-3xl flex items-center justify-center rounded-xl transition-all duration-300 transform ${
                            isFlipped ? 'bg-purple-100 rotate-y-180' : 'bg-purple-500 text-transparent'
                        }`}
                        style={{ perspective: '1000px' }}
                    >
                        {isFlipped ? card.emoji : '?'}
                    </button>
                );
            })}
        </div>
    );
};

// 3. Clicker Blitz
const ClickerGame = ({ onEarnCoins }: { onEarnCoins: (n: number) => void }) => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [score, setScore] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsFinished(true);
            const reward = Math.floor(score / 2);
            onEarnCoins(reward);
            if (score > 20) confetti();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTap = () => {
        if (!isActive && !isFinished && timeLeft === 10) {
            setIsActive(true);
        }
        if (isActive) {
            setScore(s => s + 1);
        }
    };

    const reset = () => {
        setTimeLeft(10);
        setScore(0);
        setIsActive(false);
        setIsFinished(false);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-4 border-orange-100">
            <div className="flex justify-between mb-6 text-xl font-bold text-gray-400">
                <span className="flex items-center"><Timer className="mr-2" /> {timeLeft}s</span>
                <span className="text-orange-500">{score} Clicks</span>
            </div>

            {!isFinished ? (
                <button
                    onClick={handleTap}
                    className={`w-40 h-40 rounded-full text-2xl font-black shadow-xl transition-all active:scale-95 ${
                        isActive 
                            ? 'bg-orange-500 text-white animate-pulse' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                >
                    {isActive ? "TAP!" : "START"}
                </button>
            ) : (
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Time's Up!</h3>
                    <p className="text-gray-500 mb-6">Score: {score} • Earned: {Math.floor(score / 2)} Coins</p>
                    <button 
                        onClick={reset}
                        className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-orange-600"
                    >
                        Try Again
                    </button>
                </div>
            )}
            <p className="mt-6 text-sm text-gray-400">Rapidly tap the button to score!</p>
        </div>
    );
};

export default Arcade;