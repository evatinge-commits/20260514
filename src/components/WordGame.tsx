import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GAME_DATA, COLOR_PALETTE } from '../constants';
import { playSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2 } from 'lucide-react';

export default function WordGame({ onComplete }: { onComplete: () => void }) {
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);

  // 初始化打乱后的词语序列
  useEffect(() => {
    const shuffled = [...GAME_DATA.words].sort(() => 0.5 - Math.random());
    setShuffledWords(shuffled);
  }, []);

  const currentWord = shuffledWords[currentIndex] || '';
  const GOAL = shuffledWords.length;

  const setupNextWord = () => {
    if (!currentWord) return;
    
    // Pick the character that's part of the word (usually 2nd character for these words)
    const wordChars = currentWord.split('');
    const targetChar = wordChars[1] || wordChars[0];
    
    // Generate options including the target
    let randomChars = [...GAME_DATA.characters]
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
    <div className="h-full w-full flex flex-col items-center justify-center bg-orange-50/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-orange-400">
        <div className="bg-orange-400 p-8 text-center flex flex-col items-center">
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-8xl font-black text-white">{currentWord[0]}</div>
            <div className="text-8xl font-black text-white/30 border-4 border-dashed border-white/50 rounded-2xl w-24 flex items-center justify-center">?</div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => playSound(`请拼出词语：${currentWord}`)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold mb-2 transition-colors"
          >
            <Volume2 size={24} /> 点我听读音
          </motion.button>
        </div>
        
        <div className="p-8 grid grid-cols-2 gap-4">
          {options.map((char, i) => (
            <motion.button
              key={`${char}-${i}-${currentIndex}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleChoice(char)}
              className={`${COLOR_PALETTE[i % COLOR_PALETTE.length]} h-32 rounded-3xl shadow-lg border-b-8 border-black/20 flex items-center justify-center`}
            >
              <span className="text-6xl font-bold text-white">{char}</span>
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 flex gap-2 max-w-full overflow-x-auto p-2">
        {shuffledWords.map((_, i) => (
          <motion.div
            key={i}
            animate={i === currentIndex ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className={`w-4 h-4 shrink-0 rounded-full ${i < currentIndex ? 'bg-green-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
