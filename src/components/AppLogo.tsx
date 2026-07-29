import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Palette } from 'lucide-react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showSubtitle = true,
}) => {
  // Letters configuration with vibrant colors for DobaDoba
  const letters = [
    { char: 'D', color: 'from-rose-500 to-red-600', textShadow: 'shadow-rose-500/30' },
    { char: 'o', color: 'from-amber-400 to-orange-500', textShadow: 'shadow-amber-500/30' },
    { char: 'b', color: 'from-emerald-400 to-teal-500', textShadow: 'shadow-emerald-500/30' },
    { char: 'a', color: 'from-sky-400 to-blue-600', textShadow: 'shadow-sky-500/30' },
    { char: 'D', color: 'from-purple-500 to-indigo-600', textShadow: 'shadow-purple-500/30' },
    { char: 'o', color: 'from-pink-400 to-rose-500', textShadow: 'shadow-pink-500/30' },
    { char: 'b', color: 'from-yellow-400 to-amber-500', textShadow: 'shadow-yellow-500/30' },
    { char: 'a', color: 'from-teal-400 to-emerald-500', textShadow: 'shadow-teal-500/30' },
  ];

  const sizeClasses = {
    sm: {
      container: 'gap-1',
      iconBox: 'w-8 h-8 rounded-xl text-lg',
      text: 'text-2xl font-black tracking-tight',
      badge: 'text-[10px] px-2 py-0.5',
      sparkle: 'w-3 h-3',
    },
    md: {
      container: 'gap-2',
      iconBox: 'w-12 h-12 rounded-2xl text-2xl border-2',
      text: 'text-3xl sm:text-4xl font-black tracking-tight',
      badge: 'text-xs px-3 py-1',
      sparkle: 'w-4 h-4',
    },
    lg: {
      container: 'gap-3',
      iconBox: 'w-16 h-16 sm:w-20 sm:h-20 rounded-3xl text-4xl border-4',
      text: 'text-4xl sm:text-6xl font-black tracking-tight',
      badge: 'text-xs sm:text-sm px-3.5 py-1',
      sparkle: 'w-6 h-6',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center justify-center select-none group">
      <div className={`flex items-center justify-center ${currentSize.container} relative`}>
        {/* Animated Palette Icon Box with Colorful Blobs */}
        <motion.div
          animate={{
            rotate: [-3, 3, -3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`${currentSize.iconBox} bg-gradient-to-br from-amber-300 via-pink-300 to-indigo-300 border-amber-400 shadow-lg flex items-center justify-center relative overflow-hidden flex-shrink-0`}
        >
          {/* Internal Palette Icon */}
          <span className="drop-shadow-md filter transform group-hover:scale-110 transition-transform">
            🎨
          </span>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 text-yellow-300"
          >
            <Sparkles className={currentSize.sparkle} />
          </motion.div>
        </motion.div>

        {/* Playful DobaDoba Animated Bouncy Letters */}
        <div className="flex items-center gap-0.5 relative">
          {letters.map((item, idx) => (
            <motion.span
              key={idx}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -6, scale: 1.15 }}
              transition={{
                delay: idx * 0.05,
                type: 'spring',
                stiffness: 300,
              }}
              className={`inline-block bg-gradient-to-b ${item.color} bg-clip-text text-transparent ${currentSize.text} filter drop-shadow-xs font-black`}
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.08)',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
              }}
            >
              {item.char}
            </motion.span>
          ))}

          {/* Floating Magic Wand Sparkle */}
          <motion.span
            animate={{
              rotate: [0, 20, 0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-2xl sm:text-3xl ml-1 drop-shadow-xs inline-block"
          >
            ✨
          </motion.span>
        </div>
      </div>

      {/* Optional Slogan Badge */}
      {showSubtitle && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`mt-1.5 rounded-full font-black text-amber-950 bg-gradient-to-r from-amber-200 via-pink-200 to-indigo-200 border border-amber-300/80 shadow-xs flex items-center gap-1.5 ${currentSize.badge}`}
        >
          <span>✏️</span>
          <span className="uppercase tracking-widest font-extrabold text-[11px] text-slate-800">
            Desenhos & Pintura Infantil
          </span>
          <span>🌟</span>
        </motion.div>
      )}
    </div>
  );
};
