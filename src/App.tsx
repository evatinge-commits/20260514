/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from './utils/audio';
import BalloonGame from './components/BalloonGame';
import WordGame from './components/WordGame';
import { ArrowRight, Star, Trophy, RefreshCw } from 'lucide-react';

type Level = 'START' | 'BALLOON' | 'WORD' | 'END';

export default function App() {
  const [level, setLevel] = useState<Level>('START');

  const startGame = () => {
    playSound('小朋友，让我们开始森林大冒险吧！');
    setLevel('BALLOON');
  };

  const restart = () => {
    setLevel('START');
  };

  return (
    <div className="h-screen w-full bg-green-50 font-sans selection:bg-pink-100 overflow-hidden flex flex-col relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-10">
           <img 
             src="https://picsum.photos/seed/forest/1920/1080?blur=5" 
             className="w-full h-full object-cover" 
             referrerPolicy="no-referrer"
             alt="Forest"
           />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-green-100 to-transparent opacity-50" />
      </div>

      <main className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        <AnimatePresence>
          {level === 'START' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <div className="bg-white/90 p-8 md:p-12 rounded-[50px] shadow-[0_20px_50px_rgba(34,197,94,0.3)] border-8 border-green-400 text-center backdrop-blur-md max-w-lg w-full">
                <div className="flex justify-center mb-6">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Star size={80} className="text-yellow-400 fill-yellow-400" />
                  </motion.div>
                </div>
                <h1 className="text-6xl font-black text-green-700 mb-4 tracking-tighter">识字森林</h1>
                <p className="text-2xl text-green-600 font-bold mb-10">小小冒险家，准备好了吗？</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startGame}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-6 rounded-full text-3xl font-black shadow-xl border-b-8 border-pink-700 flex items-center gap-3"
                >
                  开始 1级 <ArrowRight size={32} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {level === 'BALLOON' && (
            <motion.div 
              key="balloon" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 h-full"
            >
               <BalloonGame onComplete={() => setLevel('WORD')} />
            </motion.div>
          )}

          {level === 'WORD' && (
             <motion.div 
               key="word" 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex-1 h-full"
             >
               <WordGame onComplete={() => setLevel('END')} />
             </motion.div>
          )}

          {level === 'END' && (
            <motion.div
              key="end"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <div className="bg-white p-12 rounded-[50px] shadow-2xl border-8 border-yellow-400 text-center max-w-sm">
                <Trophy size={100} className="mx-auto text-yellow-400 mb-6 drop-shadow-xl" />
                <h2 className="text-5xl font-black text-blue-600 mb-4">大营救成功！</h2>
                <p className="text-xl text-gray-600 font-bold mb-10">你真是一个识字小天才！</p>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={restart}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-3xl text-2xl font-black shadow-lg border-b-4 border-blue-700 flex items-center justify-center gap-2"
                  >
                   <RefreshCw /> 再玩一遍
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Instructions for Parents */}
      {level === 'START' && (
        <footer className="p-4 text-center text-green-800/30 text-sm font-medium">
          给家长：本应用旨在通过视觉和听觉配合提升幼儿识字兴趣。
        </footer>
      )}
    </div>
  );
}

