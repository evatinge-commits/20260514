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
import { ArrowRight, Star, Trophy, RefreshCw, BookOpen } from 'lucide-react';
import { LESSONS, Lesson } from './constants';

type Level = 'START' | 'BALLOON' | 'WORD' | 'END';

export default function App() {
  const [level, setLevel] = useState<Level>('START');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(LESSONS[0]);

  const startGame = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    playSound(`小朋友，开始第${lesson.id}课：${lesson.title}！`);
    setLevel('BALLOON');
  };

  const restart = () => {
    setLevel('START');
  };

  return (
    <div className="h-screen w-full bg-indigo-950 font-sans selection:bg-pink-100 overflow-hidden flex flex-col relative text-white">
      {/* Space & Dinosaur Base Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(67,56,202,0.5),rgba(30,27,75,1))]" />
        <img 
          src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30" 
          referrerPolicy="no-referrer"
          alt="Space"
        />
        {/* Floating Stars */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full w-1 h-1"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5 }}
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      </div>

      <main className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {level === 'START' && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center p-6 overflow-y-auto"
            >
              <div className="mt-12 mb-8 text-center">
                <div className="flex justify-center mb-8 relative">
                  <motion.div 
                    animate={{ y: [0, -20, 0] }} 
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="relative z-10"
                  >
                    <div className="text-9xl transform -scale-x-100 filter drop-shadow-[0_0_30px_rgba(255,100,200,0.5)]">🦖</div>
                  </motion.div>
                  <div className="absolute -bottom-4 w-32 h-6 bg-black/30 rounded-full blur-lg" />
                </div>
                <h1 className="text-6xl md:text-7xl font-black text-white mb-2 tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] uppercase">
                  恐龙识字基地
                </h1>
                <p className="text-2xl text-cyan-300 font-bold tracking-widest drop-shadow-md">星际冒险家，选择你的任务！</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl pb-12 px-4">
                {LESSONS.map((lesson) => (
                  <motion.button
                    key={lesson.id}
                    whileHover={{ scale: 1.08, y: -8, rotate: lesson.id % 2 === 0 ? 1 : -1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startGame(lesson)}
                    className="bg-white/15 backdrop-blur-2xl p-8 rounded-[50px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-4 border-white/20 hover:border-cyan-300 transition-all text-left flex flex-col gap-4 group relative overflow-hidden ring-8 ring-transparent hover:ring-cyan-500/10"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-bl-[80px] flex items-center justify-center translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 shadow-lg">
                      <span className="text-white font-black text-3xl">{lesson.id}</span>
                    </div>
                    <div className="text-cyan-300 font-bold flex items-center gap-2 text-lg">
                       <BookOpen size={24} className="animate-pulse" /> 关卡 {lesson.id}
                    </div>
                    <div className="text-3xl font-black text-white leading-tight mt-2">{lesson.title}</div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {lesson.characters.slice(0, 5).map((char, i) => (
                        <span key={i} className="w-10 h-10 rounded-2xl bg-white/10 text-cyan-50 flex items-center justify-center font-black text-xl border border-white/5 shadow-inner">{char}</span>
                      ))}
                    </div>
                  </motion.button>
                ))}
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
               <BalloonGame lesson={selectedLesson} onComplete={() => setLevel('WORD')} onBack={() => setLevel('START')} />
            </motion.div>
          )}

          {level === 'WORD' && (
            <motion.div 
              key="word" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 h-full"
            >
               <WordGame lesson={selectedLesson} onComplete={() => setLevel('END')} onBack={() => setLevel('START')} />
            </motion.div>
          )}

          {level === 'END' && (
            <motion.div
              key="end"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center p-6"
            >
              <div className="bg-white/95 p-16 rounded-[60px] shadow-[0_0_100px_rgba(20,184,166,0.5)] border-8 border-cyan-400 text-center max-w-md w-full backdrop-blur-md">
                <div className="relative mb-8">
                  <Trophy size={140} className="mx-auto text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-bounce" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star size={60} className="text-teal-400 absolute -top-8 -left-4 animate-pulse fill-teal-400" />
                    <Star size={40} className="text-teal-400 absolute top-0 -right-8 animate-pulse fill-teal-400" />
                  </div>
                </div>
                <h2 className="text-6xl font-black text-indigo-900 mb-4 tracking-tighter">成功返航！</h2>
                <p className="text-2xl text-indigo-600 font-bold mb-12 italic">任务《{selectedLesson.title}》达成！</p>
                <button
                  onClick={restart}
                  className="w-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 hover:from-pink-500 hover:to-indigo-700 text-white py-8 rounded-[40px] text-4xl font-black shadow-[0_20px_0_rgba(0,0,0,0.1)] border-b-8 border-indigo-900/50 flex items-center justify-center gap-4 active:border-b-0 active:translate-y-4 transition-all shine-effect group"
                >
                   <RefreshCw size={44} className="group-hover:rotate-180 transition-transform duration-700" /> 
                   <span>回到基地</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

