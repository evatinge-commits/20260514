import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { COLOR_PALETTE, Lesson } from '../constants';
import { playSound, playSuccessSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, ArrowLeft } from 'lucide-react';

export default function BalloonGame({ lesson, onComplete, onBack }: { lesson: Lesson, onComplete: () => void, onBack: () => void }) {
  const [shuffledChars, setShuffledChars] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 初始化打乱后的生字序列
  useEffect(() => {
    const shuffled = [...lesson.characters].sort(() => 0.5 - Math.random());
    setShuffledChars(shuffled);
  }, [lesson]);

  const targetChar = shuffledChars[currentIndex] || '';
  const GOAL = shuffledChars.length;

  // 生成一轮新的题目
  const generateRound = () => {
    if (!targetChar) return;
    setIsCorrect(null);

    // 随机选3个干扰项
    const distractors = [...lesson.characters]
      .filter(c => c !== targetChar)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // 合并并打乱
    const newOptions = [...distractors, targetChar].sort(() => 0.5 - Math.random());
    setOptions(newOptions);
    
    // 获取带有组词语境的音频
    const relatedWords = lesson.words.filter(word => word.includes(targetChar)).slice(0, 2);
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
    const relatedWords = lesson.words.filter(word => word.includes(targetChar)).slice(0, 2);
    let audioText = `请找到：${targetChar}`;
    if (relatedWords.length > 0) {
      const context = relatedWords.map(w => `${w}的${targetChar}`).join('，');
      audioText = `请找到：${targetChar}。${context}`;
    }
    playSound(audioText);
  };

  if (!targetChar) return null;

  return (
    <div className="relative h-full w-full bg-slate-900/40 flex flex-col items-center justify-between p-8">
      {/* 返回按钮 */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-8 left-8 z-[60] bg-white/10 hover:bg-white/20 p-4 rounded-full border border-white/20 text-white backdrop-blur-md flex items-center gap-2 font-bold transition-colors"
      >
        <ArrowLeft size={24} /> 退出任务
      </motion.button>
      {/* 顶部题目提示区域 */}
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 mt-4 relative z-50">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 p-10 rounded-[50px] shadow-[0_0_50px_rgba(34,211,238,0.3)] border-8 border-cyan-400 flex flex-col items-center min-w-[320px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Volume2 size={80} />
          </div>
          <span className="text-2xl font-black text-indigo-600 mb-6 bg-cyan-50 px-8 py-3 rounded-full border-2 border-cyan-100">听一听，点击目标字：</span>
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={playContext}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-2xl border-4 border-white shine-effect"
          >
            <Volume2 size={80} />
          </motion.button>
          <span className="mt-4 text-cyan-600 font-black text-xl animate-pulse">点我发声哦！</span>
        </motion.div>

        {/* 进度显示 */}
        <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-full flex gap-3 items-center border border-white/10">
          <span className="text-white font-bold mr-2">进度:</span>
          {shuffledChars.map((_, i) => (
            <motion.div 
              key={i} 
              animate={i === currentIndex ? { scale: [1, 1.4, 1], boxShadow: "0 0 15px #22d3ee" } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`w-6 h-6 shrink-0 rounded-full border-2 transition-colors ${i < currentIndex ? 'bg-cyan-400 border-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-white/20 border-white/30'}`}
            />
          ))}
        </div>
      </div>

      {/* 下方可点击选项区域 */}
      <div className="w-full max-w-4xl grid grid-cols-2 gap-8 md:grid-cols-4 mb-12 relative z-10 px-4">
        <AnimatePresence mode="wait">
          {options.map((char, index) => (
            <motion.button
              key={`${char}-${index}-${currentIndex}`}
              initial={{ scale: 0, rotate: index % 2 === 0 ? -20 : 20 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ 
                scale: 1.15, 
                rotate: index % 2 === 0 ? 5 : -5,
                y: -15
              }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handleChoice(char)}
              disabled={isCorrect !== null}
              className={`
                aspect-square rounded-[50px] flex items-center justify-center 
                text-8xl font-black text-white shadow-[0_25px_0_rgba(0,0,0,0.2)]
                border-8 border-white/30 active:translate-y-6 active:shadow-none transition-all
                ${COLOR_PALETTE[index % COLOR_PALETTE.length]}
                hover:border-white ring-8 ring-transparent hover:ring-white/20 shine-effect
              `}
            >
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
              >
                {char}
              </motion.span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* 反馈层 */}
      <AnimatePresence>
        {isCorrect === true && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/20 backdrop-blur-sm p-20 rounded-full flex flex-col items-center">
               <div className="text-9xl mb-4 filter drop-shadow-[0_0_30px_#fbbf24]">🌟</div>
               <div className="text-4xl font-black text-white drop-shadow-lg">太棒了！</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
