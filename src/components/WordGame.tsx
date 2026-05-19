import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLOR_PALETTE, Lesson } from '../constants';
import { playSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, ArrowLeft } from 'lucide-react';

export default function WordGame({ lesson, onComplete, onBack }: { lesson: Lesson, onComplete: () => void, onBack: () => void }) {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);

  // 初始化打乱后的词语序列
  useEffect(() => {
    const shuffled = [...lesson.words].sort(() => 0.5 - Math.random());
    setShuffledWords(shuffled);
  }, [lesson]);

  const currentWord = shuffledWords[currentIndex] || '';
  const GOAL = shuffledWords.length;

  const setupNextWord = () => {
    if (!currentWord) return;
    
    // Pick the character that's part of the word (usually 2nd character for these words)
    const wordChars = currentWord.split('');
    const targetChar = wordChars[1] || wordChars[0];
    
    // Generate options including the target
    let randomChars = [...lesson.characters]
      .filter(c => !currentWord.includes(c))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [...randomChars, targetChar].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    playSound(`请拼出词语：${currentWord}`);
  };

  useEffect(() => {
    if (shuffledWords.length > 0) {
      setupNextWord();
    }
  }, [currentIndex, shuffledWords]);

  const handleChoice = (char: string) => {
    if (currentWord.includes(char)) {
      playSuccessSound();
      
      setTimeout(() => {
        if (currentIndex + 1 >= GOAL) {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
          });
          setTimeout(onComplete, 2000);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1000);
    } else {
      playSound('这个字不在这儿哦');
    }
  };

  if (!currentWord) return null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-indigo-900/30 p-8 relative">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-8 left-8 z-50 bg-white/10 hover:bg-white/20 p-4 rounded-full border border-white/20 text-white backdrop-blur-md flex items-center gap-2 font-bold transition-colors"
      >
        <ArrowLeft size={24} /> 退出任务
      </motion.button>
      <div className="w-full max-w-xl bg-white rounded-[60px] shadow-[0_0_50px_rgba(20,184,166,0.2)] overflow-hidden border-[12px] border-cyan-400 relative">
        <div className="bg-gradient-to-br from-indigo-500 to-cyan-500 p-12 text-center flex flex-col items-center relative">
          <div className="flex justify-center gap-6 mb-8">
            <div className="text-9xl font-black text-white drop-shadow-lg">{currentWord[0]}</div>
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-9xl font-black text-white/40 border-[6px] border-dashed border-white/30 rounded-[35px] w-32 flex items-center justify-center bg-black/5"
            >
              ?
            </motion.div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => playSound(`请拼出词语：${currentWord}`)}
            className="bg-white text-indigo-600 px-10 py-5 rounded-full flex items-center gap-3 text-2xl font-black shadow-xl hover:bg-cyan-50 transition-colors shine-effect"
          >
            <Volume2 size={32} /> 点我听词语
          </motion.button>
          
          <div className="absolute bottom-4 right-8 opacity-20 pointer-events-none">
            <div className="text-9xl grayscale brightness-200">🦖</div>
          </div>
        </div>
        
        <div className="p-10 grid grid-cols-2 gap-6 bg-slate-50">
          {options.map((char, i) => (
            <motion.button
              key={`${char}-${i}-${currentIndex}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, y: -10, rotate: i % 2 === 0 ? 5 : -5 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => handleChoice(char)}
              className={`${COLOR_PALETTE[i % COLOR_PALETTE.length]} h-44 rounded-[45px] shadow-[0_15px_0_rgba(0,0,0,0.1)] border-8 border-white/20 flex items-center justify-center active:translate-y-4 active:shadow-none transition-all shine-effect`}
            >
              <motion.span 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, delay: i * 0.3 }}
                className="text-9xl font-black text-white"
              >
                {char}
              </motion.span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mt-12 flex gap-3 max-w-full overflow-x-auto p-4 bg-white/5 rounded-full backdrop-blur-sm">
        {shuffledWords.map((_, i) => (
          <motion.div
            key={i}
            animate={i === currentIndex ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className={`w-6 h-6 shrink-0 rounded-full border-2 ${i < currentIndex ? 'bg-teal-400 border-teal-500 shadow-[0_0_15px_#2dd4bf]' : 'bg-white/20 border-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
