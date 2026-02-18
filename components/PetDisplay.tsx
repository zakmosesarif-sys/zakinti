import React from 'react';
import { motion } from 'framer-motion';
import { PetState, PetStage } from '../types';
import { PET_ASSETS } from '../constants';

interface PetDisplayProps {
  pet: PetState;
  onClick: () => void;
  message: string | null;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ pet, onClick, message }) => {
  
  const getBounceTransition = () => ({
    y: {
      duration: pet.stage === PetStage.EGG ? 2 : 0.8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  });

  return (
    <div className="relative flex flex-col items-center justify-center h-72 w-full bg-blue-50/50 rounded-3xl p-6 overflow-visible">
       {/* Background Decoration (if equipped) */}
       {pet.equippedBackground && (
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none text-9xl">
          {pet.equippedBackground}
        </div>
      )}

      {/* Chat Bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -top-6 bg-white px-4 py-2 rounded-2xl shadow-lg border-2 border-indigo-100 z-40 max-w-[200px] text-center"
        >
          <p className="text-sm font-medium text-indigo-900">{message}</p>
          <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-indigo-100 rotate-45"></div>
        </motion.div>
      )}

      {/* Pet Container */}
      <motion.div
        className="relative cursor-pointer select-none z-10 w-40 h-40 flex items-center justify-center"
        onClick={onClick}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        // @ts-ignore
        transition={getBounceTransition()}
      >
        {/* Hat Layer - Positioned relative to the container */}
        {pet.equippedHat && (
          <img 
            src={pet.equippedHat} 
            alt="Hat"
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 z-30 drop-shadow-md object-contain"
          />
        )}

        {/* The Pet 3D Image */}
        <img
            src={PET_ASSETS[pet.stage]}
            alt={pet.stage}
            className="w-full h-full object-contain drop-shadow-xl relative z-20"
            style={{ filter: pet.equippedSkin || 'none' }}
        />

        {/* Accessory Layer (Glasses, Scarves, etc) */}
        {pet.equippedAccessory && (
           <img
              src={pet.equippedAccessory}
              alt="Accessory"
              className="absolute bottom-0 right-[-10px] w-16 h-16 z-30 drop-shadow-md object-contain"
           />
        )}
      </motion.div>

      {/* Shadow under pet */}
      <div className="w-24 h-4 bg-black/10 rounded-full blur-md mt-2 z-0"></div>

      {/* Status Bar */}
      <div className="mt-8 w-full max-w-xs space-y-2 relative z-10">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
          <span>Level {pet.level}</span>
          <span>{pet.stage}</span>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((pet.xp % 100), 100)}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
        <p className="text-center text-xs text-gray-400">
          {100 - (pet.xp % 100)} XP to next level
        </p>
      </div>
    </div>
  );
};

export default PetDisplay;