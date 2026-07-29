import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AssistantType } from '../types';
import { playPetSound, playPopSound, playRainbowSound, playFanfareSound } from '../utils/audio';

interface AssistantPetProps {
  assistant: AssistantType;
  isDrawing?: boolean;
  activeColor?: string;
  currentColor?: string;
  onChangeAssistantClick?: () => void;
}

const CHEER_PHRASES = [
  'Que lindo! 🎨',
  'Uau, incrível! ✨',
  'Estou adorando! 👀',
  'Mais cor! 🌈',
  'Você é um artista! 🌟',
  'Muito legal! 🐾',
  'Continua assim! ❤️',
];

type SurpriseState =
  | 'none'
  | 'peek_left'
  | 'peek_right'
  | 'rabbit_carrot'
  | 'dog_stick_hold'
  | 'dog_stick_flying'
  | 'dog_stick_fetch'
  | 'cat_laser'
  | 'horse_gallop'
  | 'horse_apple'
  | 'turtle_spin'
  | 'fish_bubbles'
  | 'capybara_relax';

export const AssistantPet: React.FC<AssistantPetProps> = ({
  assistant,
  isDrawing = false,
  onChangeAssistantClick,
}) => {
  if (assistant === 'none') return null;

  // Position state: edge location
  const [verticalPosition, setVerticalPosition] = useState<'bottom' | 'top'>('bottom');
  const [horizontalOffset, setHorizontalOffset] = useState<number>(20); // % from left (15% to 80%)
  const [isFacingRight, setIsFacingRight] = useState<boolean>(true);
  const [speechBubble, setSpeechBubble] = useState<string | null>('Oi! Vamos desenhar? 🎨');

  // Eye tracking state
  const [eyeOffset, setEyeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reaction bounce state
  const [isBouncing, setIsBouncing] = useState(false);

  // Surprise animation state
  const [surpriseState, setSurpriseState] = useState<SurpriseState>('none');
  const [savedOffsetBeforeSurprise, setSavedOffsetBeforeSurprise] = useState<number>(20);

  // Flying stick trajectory state for Dog surprise
  const [stickFlight, setStickFlight] = useState<{ startX: number; endX: number; startY: number } | null>(null);

  // Laser position for Cat surprise
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // Fish bubbles array for Fish surprise
  const [fishBubbles, setFishBubbles] = useState<Array<{ id: number; x: number; size: number }>>([]);

  // Speech bubble timeout ref
  const bubbleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track global pointer for eye pupil movement
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const windowW = window.innerWidth || 800;
      const windowH = window.innerHeight || 600;

      const offsetX = ((e.clientX - windowW / 2) / (windowW / 2)) * 3;
      const offsetY = ((e.clientY - windowH / 2) / (windowH / 2)) * 3;

      setEyeOffset({
        x: Math.min(3, Math.max(-3, offsetX)),
        y: Math.min(3, Math.max(-3, offsetY)),
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  const triggerCheer = (text: string, duration = 3500) => {
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    setSpeechBubble(text);
    bubbleTimerRef.current = setTimeout(() => {
      setSpeechBubble(null);
    }, duration);
  };

  // Function to trigger a random surprise action based on the active assistant
  const triggerSurprise = () => {
    if (surpriseState !== 'none') return; // already performing surprise
    playPopSound();
    playPetSound(assistant);

    if (assistant === 'rabbit') {
      // Rabbit options: Edge Peek OR Carrot Munch!
      const pick = Math.random() < 0.5 ? 'peek' : 'carrot';
      if (pick === 'peek') {
        const side = Math.random() < 0.5 ? 'peek_left' : 'peek_right';
        setSavedOffsetBeforeSurprise(horizontalOffset);
        setSurpriseState(side);
        setIsFacingRight(side === 'peek_left');

        if (side === 'peek_left') {
          triggerCheer('Escondidinho na esquerda! 🐰 Achou?', 4500);
          setHorizontalOffset(0);
        } else {
          triggerCheer('Escondidinho na direita! 🐰 Achou?', 4500);
          setHorizontalOffset(88);
        }

        setTimeout(() => {
          setHorizontalOffset(savedOffsetBeforeSurprise || 25);
          setSurpriseState('none');
          triggerCheer('Voltei! 💫', 2500);
        }, 5000);
      } else {
        setSurpriseState('rabbit_carrot');
        playRainbowSound();
        triggerCheer('Olha minha cenoura gostosa! 🥕✨ Nhac nhac!', 5500);
        setIsBouncing(true);

        setTimeout(() => {
          setIsBouncing(false);
          setSurpriseState('none');
        }, 6000);
      }
    } else if (assistant === 'dog') {
      // Dog surprise: Grab stick & throw across screen!
      setSavedOffsetBeforeSurprise(horizontalOffset);
      setSurpriseState('dog_stick_hold');
      triggerCheer('Achei um graveto! 🪵 Prepara...', 2000);

      setTimeout(() => {
        const startX = horizontalOffset;
        const endX = startX > 50 ? Math.floor(Math.random() * 25) + 10 : Math.floor(Math.random() * 25) + 65;
        const startY = verticalPosition === 'top' ? 60 : window.innerHeight - 120;

        setStickFlight({ startX, endX, startY });
        setSurpriseState('dog_stick_flying');
        playPopSound();
        triggerCheer('Lancei o graveto! 🪵💨', 2000);

        setTimeout(() => {
          setSurpriseState('dog_stick_fetch');
          setIsFacingRight(endX > startX);
          setHorizontalOffset(endX);
          playPetSound('dog');

          setTimeout(() => {
            playFanfareSound();
            setIsBouncing(true);
            triggerCheer('Peguei o graveto! 🐶🪵 Uau!', 3000);

            setTimeout(() => {
              setIsBouncing(false);
              setStickFlight(null);
              setSurpriseState('none');
            }, 3000);
          }, 1200);
        }, 1500);
      }, 2000);
    } else if (assistant === 'cat') {
      // Cat surprise: Chase Laser Pointer
      setSurpriseState('cat_laser');
      setLaserPos({ x: 30, y: 40 });
      triggerCheer('Olha o ponto vermelho! 🔴 Miau!', 4500);

      const laserInterval = setInterval(() => {
        setLaserPos({
          x: Math.floor(Math.random() * 70) + 15,
          y: Math.floor(Math.random() * 50) + 20,
        });
      }, 800);

      setTimeout(() => {
        clearInterval(laserInterval);
        setLaserPos(null);
        setSurpriseState('none');
        triggerCheer('Peguei! 🐾', 2500);
      }, 5000);
    } else if (assistant === 'horse') {
      // Cavalo Elegante surprise: Gallop & eat a juicy red apple!
      const pick = Math.random() < 0.5 ? 'apple' : 'gallop';
      if (pick === 'apple') {
        setSurpriseState('horse_apple');
        playFanfareSound();
        setIsBouncing(true);
        triggerCheer('Nhac! Delícia de maçã! 🐴🍎✨', 4500);

        setTimeout(() => {
          setIsBouncing(false);
          setSurpriseState('none');
        }, 5000);
      } else {
        setSurpriseState('horse_gallop');
        playRainbowSound();
        triggerCheer('Galopando com elegância! 🎩🐴', 4500);
        
        // Gallop left and right
        const origPos = horizontalOffset;
        setIsFacingRight(true);
        setHorizontalOffset(Math.min(80, origPos + 35));

        setTimeout(() => {
          setIsFacingRight(false);
          setHorizontalOffset(Math.max(15, origPos - 20));

          setTimeout(() => {
            setIsFacingRight(true);
            setHorizontalOffset(origPos);
            setSurpriseState('none');
          }, 1800);
        }, 1800);
      }
    } else if (assistant === 'turtle') {
      // Tartaruga Samurai surprise: Spin into shell with samurai katana slash!
      setSurpriseState('turtle_spin');
      playFanfareSound();
      triggerCheer('Giro Ninja Samurai! 🐢⚔️ Faixa vermelha!', 4500);

      setTimeout(() => {
        setSurpriseState('none');
      }, 4500);
    } else if (assistant === 'fish') {
      // Peixe Nemo surprise: Blow colorful bubbles floating up screen!
      setSurpriseState('fish_bubbles');
      playRainbowSound();
      triggerCheer('Blub blub! 🫧 Olhem as bolhas!', 5000);

      const newBubbles = Array.from({ length: 7 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.floor(Math.random() * 60) + 20,
        size: Math.floor(Math.random() * 20) + 15,
      }));
      setFishBubbles(newBubbles);

      setTimeout(() => {
        setFishBubbles([]);
        setSurpriseState('none');
      }, 5000);
    } else if (assistant === 'capybara') {
      // Capivara Tranquila surprise: Relaxes with a mandarin on head & bird friend
      setSurpriseState('capybara_relax');
      playRainbowSound();
      triggerCheer('Tão tranquilo... 🦫🍊 zzz', 5500);

      setTimeout(() => {
        setSurpriseState('none');
      }, 5500);
    }
  };

  // React when assistant changes (switching assistant)
  useEffect(() => {
    if (assistant === 'none') return;

    // Toggle vertical position between top and bottom
    setVerticalPosition((prev) => (prev === 'bottom' ? 'top' : 'bottom'));

    // Move to a new random horizontal position
    const newX = Math.floor(Math.random() * 60) + 20;
    setIsFacingRight(newX > horizontalOffset);
    setHorizontalOffset(newX);

    // Visual & audio feedback
    setIsBouncing(true);
    playPopSound();
    playPetSound(assistant);

    const greetings: Record<AssistantType, string> = {
      rabbit: 'Oi, sou o Coelho Rabicho! 🐰🥕',
      cat: 'Miau! Sou a Gata Mimi! 🐱✨',
      dog: 'Au au! Sou o Cachorro Caramelo! 🐶🪵',
      horse: 'Elegância! Sou o Cavalo Elegante! 🎩🐴',
      turtle: 'Ninja! Sou a Tartaruga Samurai! 🐢⚔️',
      fish: 'Blub! Sou o Peixe Nemo! 🐠🫧',
      capybara: 'Tranquilo! Sou a Capivara! 🦫🍊',
      none: '',
    };

    triggerCheer(greetings[assistant] || 'Oi! Cheguei em novo lugar! 🐾', 3500);
    const timer = setTimeout(() => setIsBouncing(false), 800);
    return () => clearTimeout(timer);
  }, [assistant]);

  // Periodic walking / spontaneous surprise chance
  useEffect(() => {
    const interval = setInterval(() => {
      if (surpriseState !== 'none') return;

      const rand = Math.random();
      // 40% chance to do a spontaneous surprise!
      if (rand < 0.40) {
        triggerSurprise();
      } else if (rand < 0.70) {
        // Walk to a new spot along edge
        const newPos = Math.floor(Math.random() * 65) + 15;
        setIsFacingRight(newPos > horizontalOffset);
        setHorizontalOffset(newPos);
      } else if (rand < 0.85) {
        // Switch between top and bottom edge
        setVerticalPosition((prev) => (prev === 'bottom' ? 'top' : 'bottom'));
        triggerCheer('Pulei! 🐾', 2000);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [horizontalOffset, surpriseState, assistant]);

  // React when user starts drawing
  useEffect(() => {
    if (isDrawing && surpriseState === 'none') {
      setIsBouncing(true);
      if (Math.random() < 0.4) {
        const randomPhrase = CHEER_PHRASES[Math.floor(Math.random() * CHEER_PHRASES.length)];
        triggerCheer(randomPhrase);
      }
      const timer = setTimeout(() => setIsBouncing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isDrawing, surpriseState]);

  const handlePetClick = () => {
    if (surpriseState !== 'none') return;

    playPopSound();
    playPetSound(assistant);
    setIsBouncing(true);

    // Always toggle vertical position (top <-> bottom) on click!
    const nextPos = verticalPosition === 'bottom' ? 'top' : 'bottom';
    setVerticalPosition(nextPos);

    // Pick a new horizontal spot along the edge
    const newX = Math.floor(Math.random() * 60) + 20;
    setIsFacingRight(newX > horizontalOffset);
    setHorizontalOffset(newX);

    // 50% chance to trigger a surprise animation or show a cheerful jump phrase
    if (Math.random() < 0.50) {
      triggerSurprise();
    } else {
      const phrases =
        nextPos === 'top'
          ? ['Pulei pro topo! ⬆️', 'Olhando do alto! 🌟', 'Uau! 🐾', 'Que alto! ✨']
          : ['Voltei pra baixo! ⬇️', 'Oi de novo! ❤️', 'Vamos desenhar! 🎨', 'Aqui embaixo! 🐾'];

      triggerCheer(phrases[Math.floor(Math.random() * phrases.length)]);
    }

    setTimeout(() => setIsBouncing(false), 600);
  };

  const isPeek = surpriseState === 'peek_left' || surpriseState === 'peek_right';

  return (
    <>
      {/* Laser Pointer Dot for Cat Surprise */}
      <AnimatePresence>
        {assistant === 'cat' && surpriseState === 'cat_laser' && laserPos && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ left: `${laserPos.x}%`, top: `${laserPos.y}%`, scale: [1, 1.3, 1], opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            <div className="w-5 h-5 rounded-full bg-red-500 shadow-[0_0_15px_#ef4444] animate-ping" />
            <div className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_10px_#dc2626] absolute top-0.5 left-0.5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flying Stick for Dog Surprise */}
      <AnimatePresence>
        {assistant === 'dog' && surpriseState === 'dog_stick_flying' && stickFlight && (
          <motion.div
            initial={{
              left: `${stickFlight.startX}%`,
              top: `${stickFlight.startY}px`,
              rotate: 0,
              scale: 0.8,
            }}
            animate={{
              left: `${stickFlight.endX}%`,
              top: [stickFlight.startY, stickFlight.startY - 140, stickFlight.startY],
              rotate: 720,
              scale: [0.8, 1.2, 1],
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-amber-800 border-2 border-amber-950 text-amber-100 font-bold px-3 py-1 rounded-full shadow-2xl flex items-center gap-1.5 transform rotate-12">
              <span className="text-lg">🪵</span>
              <span className="text-[10px] text-amber-200 uppercase tracking-widest">Graveto</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubbles for Fish Surprise */}
      <AnimatePresence>
        {assistant === 'fish' && surpriseState === 'fish_bubbles' && fishBubbles.length > 0 && (
          <>
            {fishBubbles.map((bubble, idx) => (
              <motion.div
                key={bubble.id}
                initial={{
                  left: `${bubble.x}%`,
                  bottom: '10%',
                  opacity: 0,
                  scale: 0.2,
                }}
                animate={{
                  bottom: ['10%', '90%'],
                  x: [0, idx % 2 === 0 ? 30 : -30, 0],
                  opacity: [0, 0.9, 0],
                  scale: [0.2, 1.2, 1],
                }}
                transition={{
                  duration: 3 + (idx % 3),
                  delay: idx * 0.3,
                  ease: 'easeOut',
                }}
                className="fixed z-50 pointer-events-none rounded-full bg-cyan-400/30 border-2 border-cyan-200 backdrop-blur-xs flex items-center justify-center shadow-[0_0_12px_#38bdf8]"
                style={{ width: bubble.size * 2, height: bubble.size * 2 }}
              >
                <div className="w-2 h-2 rounded-full bg-white opacity-80 absolute top-1 left-1" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Pet Container */}
      <div
        aria-label="Assistente Animado"
        className={`fixed z-40 transition-all duration-700 ease-in-out pointer-events-auto select-none ${
          verticalPosition === 'top' ? 'top-10' : 'bottom-12 sm:bottom-14'
        }`}
        style={{
          left: `${horizontalOffset}%`,
          transform: isPeek
            ? surpriseState === 'peek_left'
              ? 'translateX(-55%)'
              : 'translateX(45%)'
            : 'translateX(0)',
        }}
      >
        <div className="relative flex flex-col items-center group">
          {/* Speech Bubble */}
          <AnimatePresence>
            {speechBubble && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 10 }}
                className="absolute -top-12 sm:-top-14 bg-white text-slate-800 font-extrabold text-[11px] sm:text-xs px-3 py-1.5 rounded-2xl shadow-xl border-2 border-amber-300 whitespace-nowrap z-50 flex items-center gap-1.5"
              >
                <span>{speechBubble}</span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-white" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rabbit Crunching Carrot (Cenoura) Overlay */}
          <AnimatePresence>
            {assistant === 'rabbit' && surpriseState === 'rabbit_carrot' && (
              <motion.div
                initial={{ scale: 0, x: -20, y: 15 }}
                animate={{
                  scale: [1, 1.25, 1],
                  x: [-15, 15, -10, 0],
                  y: [5, -10, 5, 0],
                  rotate: [0, 15, -15, 0],
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 5.5, ease: 'easeInOut' }}
                className="absolute -bottom-2 left-12 z-50 pointer-events-none"
              >
                <div className="relative flex flex-col items-center">
                  <div className="bg-amber-100/90 border-2 border-orange-400 text-orange-600 font-extrabold px-3 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 backdrop-blur-xs">
                    <span className="text-xl sm:text-2xl animate-bounce">🥕</span>
                    <span className="text-xs sm:text-sm text-orange-700 font-black uppercase tracking-wider">Cenoura!</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cavalo Elegante Apple Overlay */}
          <AnimatePresence>
            {assistant === 'horse' && surpriseState === 'horse_apple' && (
              <motion.div
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: [1, 1.2, 1], y: [0, -10, 0], rotate: [0, 15, -15, 0] }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 4.5 }}
                className="absolute -top-3 -left-6 z-50 pointer-events-none text-2xl"
              >
                🍎✨
              </motion.div>
            )}
          </AnimatePresence>

          {/* Capivara Relax Zzz Overlay */}
          <AnimatePresence>
            {assistant === 'capybara' && surpriseState === 'capybara_relax' && (
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: [-5, -30] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-4 z-50 pointer-events-none font-black text-amber-700 text-sm tracking-widest"
              >
                Zzz... 🌿
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascot Container with Bounce / Flip / Spin animations */}
          <motion.div
            animate={{
              y: isBouncing
                ? [0, -22, 0]
                : surpriseState === 'rabbit_carrot'
                ? [0, -12, 0]
                : surpriseState === 'horse_gallop'
                ? [0, -15, 0]
                : [0, -3, 0],
              rotate: surpriseState === 'turtle_spin' ? [0, 720, 1440] : 0,
              scale: isBouncing ? [1, 1.18, 1] : 1,
              scaleX: isFacingRight ? 1 : -1,
            }}
            transition={{
              y: isBouncing
                ? { duration: 0.5 }
                : surpriseState === 'rabbit_carrot' || surpriseState === 'horse_gallop'
                ? { duration: 0.4, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              rotate: surpriseState === 'turtle_spin' ? { duration: 4, ease: 'easeInOut' } : {},
              scale: { duration: 0.4 },
            }}
            onClick={handlePetClick}
            className="w-16 h-16 sm:w-20 sm:h-20 cursor-pointer drop-shadow-xl relative hover:scale-110 active:scale-95 transition-transform"
            title={`Assistente (${assistant}) - Toque para interagir!`}
          >
            {/* 1. RABBIT (Coelho: White body, black ears, nose, and tail) */}
            {assistant === 'rabbit' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="82" cy="72" r="9" fill="#111827" />
                <ellipse cx="40" cy="22" rx="7" ry="20" fill="#111827" transform="rotate(-10 40 22)" />
                <ellipse cx="40" cy="22" rx="4" ry="15" fill="#F472B6" transform="rotate(-10 40 22)" />
                <ellipse cx="60" cy="22" rx="7" ry="20" fill="#111827" transform="rotate(10 60 22)" />
                <ellipse cx="60" cy="22" rx="4" ry="15" fill="#F472B6" transform="rotate(10 60 22)" />

                {!isPeek && (
                  <ellipse cx="50" cy="65" rx="28" ry="22" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
                )}

                <circle cx="50" cy="45" r="22" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />

                <circle
                  cx={42 + (isPeek ? (surpriseState === 'peek_left' ? 2 : -2) : eyeOffset.x)}
                  cy={42 + eyeOffset.y}
                  r="5"
                  fill="#1E293B"
                />
                <circle
                  cx={58 + (isPeek ? (surpriseState === 'peek_left' ? 2 : -2) : eyeOffset.x)}
                  cy={42 + eyeOffset.y}
                  r="5"
                  fill="#1E293B"
                />
                <circle cx={43.5 + eyeOffset.x} cy={40.5 + eyeOffset.y} r="2" fill="#FFFFFF" />
                <circle cx={59.5 + eyeOffset.x} cy={40.5 + eyeOffset.y} r="2" fill="#FFFFFF" />

                <circle cx="36" cy="48" r="4" fill="#F472B6" opacity="0.6" />
                <circle cx="64" cy="48" r="4" fill="#F472B6" opacity="0.6" />

                <polygon points="50,46 47,50 53,50" fill="#000000" />

                {surpriseState === 'rabbit_carrot' ? (
                  <>
                    <ellipse cx="42" cy="58" rx="5" ry="7" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                    <ellipse cx="58" cy="58" rx="5" ry="7" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                  </>
                ) : !isPeek ? (
                  <>
                    <circle cx="38" cy="82" r="6" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                    <circle cx="62" cy="82" r="6" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
                  </>
                ) : null}
              </svg>
            )}

            {/* 2. CAT (Gato: Black cat) */}
            {assistant === 'cat' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M 72 65 C 88 60, 88 35, 78 30"
                  fill="none"
                  stroke="#18181B"
                  strokeWidth="7"
                  strokeLinecap="round"
                />

                <polygon points="32,28 30,12 47,24" fill="#18181B" />
                <polygon points="53,24 70,12 68,28" fill="#18181B" />

                <ellipse cx="50" cy="65" rx="25" ry="20" fill="#18181B" />
                <circle cx="50" cy="42" r="21" fill="#18181B" />

                <polygon points="35,24 33,16 43,23" fill="#EC4899" />
                <polygon points="57,23 67,16 65,24" fill="#EC4899" />

                <ellipse cx="41" cy="40" rx="5.5" ry="6.5" fill="#FACC15" />
                <ellipse cx="59" cy="40" rx="5.5" ry="6.5" fill="#FACC15" />
                <ellipse cx={41 + eyeOffset.x * 0.8} cy={40 + eyeOffset.y * 0.8} rx="2" ry="4.5" fill="#000000" />
                <ellipse cx={59 + eyeOffset.x * 0.8} cy={40 + eyeOffset.y * 0.8} rx="2" ry="4.5" fill="#000000" />
                <circle cx="42.5" cy="38" r="1.5" fill="#FFFFFF" />
                <circle cx="60.5" cy="38" r="1.5" fill="#FFFFFF" />

                <polygon points="50,47 47,50 53,50" fill="#EC4899" />

                <line x1="28" y1="46" x2="18" y2="44" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="28" y1="49" x2="16" y2="50" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="72" y1="46" x2="82" y2="44" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="72" y1="49" x2="84" y2="50" stroke="#E4E4E7" strokeWidth="1.5" strokeLinecap="round" />

                <ellipse cx="38" cy="82" rx="6" ry="4" fill="#27272A" />
                <ellipse cx="62" cy="82" rx="6" ry="4" fill="#27272A" />
              </svg>
            )}

            {/* 3. DOG (Cachorro: Orange dog) */}
            {assistant === 'dog' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M 72 65 C 82 58, 86 42, 80 35"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="80" cy="35" r="4" fill="#FFFFFF" />

                <ellipse cx="26" cy="40" rx="9" ry="18" fill="#C2410C" transform="rotate(20 26 40)" />
                <ellipse cx="74" cy="40" rx="9" ry="18" fill="#C2410C" transform="rotate(-20 74 40)" />

                <ellipse cx="50" cy="65" rx="26" ry="20" fill="#F97316" />
                <ellipse cx="50" cy="68" rx="14" ry="13" fill="#FFEDD5" />

                <circle cx="50" cy="42" r="22" fill="#F97316" />

                <ellipse cx="50" cy="48" rx="12" ry="8" fill="#FFEDD5" />

                <ellipse cx="50" cy="44" rx="4" ry="3" fill="#000000" />

                {(surpriseState === 'dog_stick_hold' || surpriseState === 'dog_stick_fetch') && (
                  <g transform="translate(20, 48) rotate(-10)">
                    <rect x="0" y="0" width="60" height="7" rx="3.5" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
                    <rect x="15" y="-3" width="8" height="4" rx="1" fill="#92400E" />
                    <rect x="40" y="6" width="8" height="4" rx="1" fill="#92400E" />
                  </g>
                )}

                <circle cx={41 + eyeOffset.x * 0.7} cy={38 + eyeOffset.y * 0.7} r="4" fill="#1E293B" />
                <circle cx={59 + eyeOffset.x * 0.7} cy={38 + eyeOffset.y * 0.7} r="4" fill="#1E293B" />
                <circle cx={42 + eyeOffset.x * 0.7} cy={36.5 + eyeOffset.y * 0.7} r="1.5" fill="#FFFFFF" />
                <circle cx={60 + eyeOffset.x * 0.7} cy={36.5 + eyeOffset.y * 0.7} r="1.5" fill="#FFFFFF" />

                {surpriseState !== 'dog_stick_hold' && surpriseState !== 'dog_stick_fetch' && (
                  <path d="M 47 52 Q 50 58 53 52 Z" fill="#F43F5E" />
                )}

                <ellipse cx="38" cy="82" rx="6" ry="4" fill="#FFEDD5" />
                <ellipse cx="62" cy="82" rx="6" ry="4" fill="#FFEDD5" />
              </svg>
            )}

            {/* 4. HORSE (Cavalo Elegante) */}
            {assistant === 'horse' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M 75 62 C 85 68, 88 82, 82 90" fill="none" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
                <polygon points="36,25 42,10 46,26" fill="#854D0E" />
                <polygon points="54,26 58,10 64,25" fill="#854D0E" />
                <ellipse cx="50" cy="68" rx="26" ry="18" fill="#B45309" />
                <path d="M 38 45 L 45 28 L 58 28 L 62 48 Z" fill="#B45309" />
                <path d="M 38 22 C 34 26, 32 38, 36 48" fill="none" stroke="#451A03" strokeWidth="5" strokeLinecap="round" />
                <ellipse cx="50" cy="38" rx="15" ry="18" fill="#B45309" />
                <ellipse cx="50" cy="46" rx="10" ry="7" fill="#78350F" />
                <circle cx="46" cy="46" r="2" fill="#1E293B" />
                <circle cx="54" cy="46" r="2" fill="#1E293B" />

                {/* Eye tracking */}
                <circle cx={43 + eyeOffset.x * 0.7} cy={34 + eyeOffset.y * 0.7} r="3.5" fill="#1E293B" />
                <circle cx={57 + eyeOffset.x * 0.7} cy={34 + eyeOffset.y * 0.7} r="3.5" fill="#1E293B" />
                <circle cx={44 + eyeOffset.x * 0.7} cy={33 + eyeOffset.y * 0.7} r="1.2" fill="#FFFFFF" />
                <circle cx={58 + eyeOffset.x * 0.7} cy={33 + eyeOffset.y * 0.7} r="1.2" fill="#FFFFFF" />

                {/* Top Hat */}
                <rect x="38" y="10" width="24" height="4" rx="2" fill="#0F172A" />
                <rect x="42" y="1" width="16" height="10" rx="1" fill="#0F172A" />
                <rect x="42" y="8" width="16" height="2" fill="#DC2626" />

                {/* Bowtie */}
                <polygon points="45,55 50,57 45,59" fill="#DC2626" />
                <polygon points="55,55 50,57 55,59" fill="#DC2626" />
                <circle cx="50" cy="57" r="2" fill="#991B1B" />
              </svg>
            )}

            {/* 5. TURTLE (Tartaruga Samurai) */}
            {assistant === 'turtle' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="28" cy="72" r="8" fill="#15803D" />
                <circle cx="72" cy="72" r="8" fill="#15803D" />
                <circle cx="28" cy="52" r="7" fill="#15803D" />
                <circle cx="72" cy="52" r="7" fill="#15803D" />
                <ellipse cx="50" cy="62" rx="28" ry="22" fill="#166534" stroke="#052E16" strokeWidth="2.5" />
                <polygon points="50,45 62,54 62,68 50,76 38,68 38,54" fill="#22C55E" opacity="0.4" />
                <circle cx="50" cy="35" r="18" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                <rect x="31" y="30" width="38" height="8" rx="3" fill="#DC2626" />
                <path d="M 68 33 Q 80 30 82 40" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
                <path d="M 68 35 Q 78 42 75 50" fill="none" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />

                {/* Eyes */}
                <circle cx="43" cy="34" r="3.5" fill="#FFFFFF" />
                <circle cx="57" cy="34" r="3.5" fill="#FFFFFF" />
                <circle cx={43 + eyeOffset.x * 0.5} cy={34 + eyeOffset.y * 0.5} r="2" fill="#000000" />
                <circle cx={57 + eyeOffset.x * 0.5} cy={34 + eyeOffset.y * 0.5} r="2" fill="#000000" />

                <path d="M 46 44 Q 50 48 54 44" fill="none" stroke="#052E16" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}

            {/* 6. FISH (Peixe Nemo) */}
            {assistant === 'fish' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polygon points="70,50 88,32 88,68" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
                <polygon points="76,50 88,38 88,62" fill="#FFFFFF" opacity="0.6" />
                <path d="M 40 32 Q 55 18 65 34" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
                <ellipse cx="48" cy="50" rx="28" ry="20" fill="#F97316" stroke="#7C2D12" strokeWidth="2" />
                <path d="M 38 31 Q 35 50 38 69" fill="none" stroke="#FFFFFF" strokeWidth="7" />
                <path d="M 38 31 Q 35 50 38 69" fill="none" stroke="#000000" strokeWidth="1" />
                <path d="M 56 31 Q 53 50 56 69" fill="none" stroke="#FFFFFF" strokeWidth="6" />

                {/* Big Eyes */}
                <circle cx="32" cy="44" r="6" fill="#FFFFFF" />
                <circle cx={32 + eyeOffset.x * 0.7} cy={44 + eyeOffset.y * 0.7} r="3.5" fill="#000000" />
                <circle cx={33.5 + eyeOffset.x * 0.7} cy={42 + eyeOffset.y * 0.7} r="1.5" fill="#FFFFFF" />

                <path d="M 44 54 Q 38 64 48 62" fill="#EA580C" stroke="#7C2D12" strokeWidth="2" />
              </svg>
            )}

            {/* 7. CAPYBARA (Capivara Tranquila) */}
            {assistant === 'capybara' && (
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="35" cy="30" r="5" fill="#78350F" />
                <circle cx="65" cy="30" r="5" fill="#78350F" />
                <ellipse cx="50" cy="65" rx="30" ry="22" fill="#A16207" />
                <rect x="32" y="32" width="36" height="32" rx="14" fill="#A16207" />
                <rect x="36" y="46" width="28" height="16" rx="8" fill="#78350F" />
                <ellipse cx="44" cy="52" rx="2" ry="3" fill="#1E293B" />
                <ellipse cx="56" cy="52" rx="2" ry="3" fill="#1E293B" />

                {surpriseState === 'capybara_relax' ? (
                  <>
                    {/* Sleepy closed eyes */}
                    <path d="M 40 40 Q 43 43 46 40" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 54 40 Q 57 43 60 40" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M 40 40 Q 43 36 46 40" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 54 40 Q 57 36 60 40" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}

                {/* Orange fruit on head */}
                <circle cx="50" cy="24" r="8" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
                <path d="M 50 16 Q 54 12 56 16" fill="#22C55E" />

                {/* Cute Bird friend on capybara during relax surprise */}
                {surpriseState === 'capybara_relax' && (
                  <g transform="translate(62, 14)">
                    <circle cx="6" cy="6" r="5" fill="#FACC15" />
                    <polygon points="10,6 14,4 11,8" fill="#F97316" />
                    <circle cx="5" cy="5" r="1" fill="#000000" />
                  </g>
                )}

                <ellipse cx="38" cy="84" rx="6" ry="4" fill="#78350F" />
                <ellipse cx="62" cy="84" rx="6" ry="4" fill="#78350F" />
              </svg>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};
