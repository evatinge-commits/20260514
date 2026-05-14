import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GAME_DATA, COLOR_PALETTE } from '../constants';
import { playSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2 } from 'lucide-react';

export default function BalloonGame({ onComplete }: { onComplete: () => void }) {
  const [shuffledChars, setShuffledChars] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 初始化打乱后的生字序列
  useEffect(() => {
    const shuffled = [...GAME_DATA.characters].sort(() => 0.5 - Math.random());
    setShuffledChars(shuffled);
  }, []);

  const targetChar = shuffledChars[currentIndex] || '';
  const GOAL = shuffledChars.length;

  // 生成一轮新的题目
  const generateRound = () => {
    if (!targetChar) return;
    setIsCorrect(null);

    // 随机选3个干扰项
    const distractors = [...GAME_DATA.characters]
      .filter(c => c !== targetChar)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // 合并并打乱
    const newOptions = [...distractors, targetChar].sort(() => 0.5 - Math.random());
    setOptions(newOptions);
    
    // 获取带有组词语境的音频
    const relatedWords = GAME_DATA.words.filter(word => word.includes(targetChar)).slice(0, 2);
    let audioText = `请找到：${targetChar}`;
    if (relatedWords.length > 0) {
      const context = relatedWords.map(w => `${w}的${targetChar}`).join('，');
      audioText = `请找到：${targetChar}。${context}`;
    }
    playSound(audioText);
  };

  useEffect(() => {
    if (shuffledChars.length > 0) {
      generateRound();
    }
  }, [currentIndex, shuffledChars]);

  const handleChoice = (choice: string) => {
    if (choice === targetChar) {
      setIsCorrect(true);
      playSuccessSound();
      
      setTimeout(() => {
        if (currentIndex + 1 >= GOAL) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          setTimeout(onComplete, 1500);
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      }, 1000);
    } else {
      setIsCorrect(false);
      playSound('不对哦');
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  const playContext = () => {
    if (!targetChar) return;
    const relatedWords = GAME_DATA.words.filter(word => word.includes(targetChar)).slice(0, 2);
    let audioText = `请找到：${targetChar}`;
    if (relatedWords.length > 0) {
      const context = relatedWords.map(w => `${w}的${targetChar}`).join('，');
      audioText = `请找到：${targetChar}。${context}`;
    }
    playSound(audioText);
  };

  if (!targetChar) return null;

  return (
    <div className="relative h-full w-full bg-sky-50/50 flex flex-col items-center justify-between p-8">
      {/* 顶部题目提示区域 - 不可点击 */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-6 mt-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 p-8 rounded-[40px] shadow-2xl border-8 border-blue-400 flex flex-col items-center min-w-[280px]"
        >
          <span className="text-2xl font-black text-blue-500 mb-4 bg-blue-50 px-6 py-2 rounded-full">听一听，找一找：</span>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={playContext}
            className="w-32 h-32 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shadow-inner border-4 border-pink-200"
          >
            <Volume2 size={64} />
          </motion.button>
          <span className="mt-4 text-gray-400 font-bold">点一点听读音</span>
        </motion.div>

        {/* 进度条 */}
        <div className="flex gap-2 max-w-full overflow-x-auto p-2">
          {shuffledChars.map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 shrink-0 rounded-full border-2 ${i < currentIndex ? 'bg-yellow-400 border-yellow-500' : 'bg-white border-blue-100'}`}
            />
          ))}
        </div>
      </div>

      {/* 下方可点击选项区域 */}
      <div className="w-full max-w-3xl grid grid-cols-2 gap-6 md:grid-cols-4 mb-8">
        <AnimatePresence mode="wait">
          {options.map((char, index) => (
            <motion.button
              key={`${char}-${index}-${currentIndex}`}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleChoice(char)}
              disabled={isCorrect !== null}
              className={`
                aspect-square rounded-full flex items-center justify-center 
                text-6xl font-black text-white shadow-[0_15px_0_rgba(0,0,0,0.15)]
                border-4 border-white/40 active:translate-y-2 active:shadow-none transition-all
                ${COLOR_PALETTE[index % COLOR_PALETTE.length]}
              `}
            >
              {char}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* 反馈层 */}
      <AnimatePresence>
        {isCorrect === true && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/80 p-10 rounded-full text-9xl">🌟</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
