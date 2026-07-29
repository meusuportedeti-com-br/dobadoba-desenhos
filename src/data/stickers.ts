export interface StickerItem {
  id: string;
  emoji: string;
  name: string;
  category: 'animais' | 'natureza' | 'formas' | 'comida' | 'objetos' | 'caretas';
  categoryLabel: string;
  badge?: string;
}

export const STICKER_CATEGORIES = [
  { id: 'todos', label: 'Todos Os 500 Adesivos', icon: '✨' },
  { id: 'animais', label: 'Animais 🐶', icon: '🐶' },
  { id: 'natureza', label: 'Natureza & Céu ☀️', icon: '☀️' },
  { id: 'formas', label: 'Formas & Festa ❤️', icon: '❤️' },
  { id: 'comida', label: 'Comidas & Doces 🍦', icon: '🍦' },
  { id: 'objetos', label: 'Brinquedos & Esportes 🚀', icon: '🚀' },
  { id: 'caretas', label: 'Rostinhos & Caretas 🤪', icon: '🤪' },
];

const RAW_ANIMAIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','polar',
  '🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉',
  '🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅',
  '🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌',
  '🐞','🐜','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖',
  '🦕','🐙','🦑','🦐','🦞','crab','🐡','🐠','🐟','🐬',
  '🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣',
  '🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂',
  '🐄','🐎','🐖','🦙','🐐','🦌','🐕','🐩','🐈','🐓',
  '🦃','🦚','🦜','🦩','🕊️','🐇','🦝','🦨','🦡','🦦',
  '🦥','🐁','🐀','🐿️','🦔','🐾'
];

// Replaces placeholders with valid animal emojis
const ANIMAIS_EMOJIS = [
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨',
  '🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊',
  '🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉',
  '🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞',
  '🐜','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕',
  '🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳',
  '🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘',
  '🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄',
  '🐎','🐖','🦙','🐐','🦌','🐕','🐩','🐈','🐈‍⬛','🐓',
  '🦃','🦚','🦜','🦩','🕊️','🐇','🦝','🦨','🦡','🦫',
  '🦦','🦥','🐁','🐀','🐿️','🦔','🐾','🦦'
];

const NATUREZA_EMOJIS = [
  '☀️','🌝','🌛','⭐','🌟','💫','✨','🌙','🪐','☁️',
  '⛅','🌩️','🌧️','🌨️','❄️','⚡','🌈','🌊','🌪️','🌌',
  '🌋','🏔️','🏞️','🏖️','🏜️','🏝️','⛺','🌲','🌳','🌴',
  '🌵','🌾','🌿','☘️','🍀','🍁','🍂','🍃','🍄','🌸',
  '🏵️','🌹','🌺','🌻','🌼','🌷','🌱','🪴','🎋','🎍',
  '🌞','🌜','🌌','🌠','☄️','🌍','🌎','🌏','🌖','🌓',
  '🌔','🌒','🌘','🌑','🎑','🌅','🌄','🌇','🌆','🏙️',
  '♨️','🪵','🪨','🔥','💧','🌬️','🌫️','🫧','🌺','🌻',
  '🌷','🌱','🌾','🍂','🍁','🌊','🌀','🌌'
];

const COMIDA_EMOJIS = [
  '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐',
  '🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🍆',
  '🥦','🥬','🥒','🌶️','🌽','🥕','🧄','🧅','🥔','🍠',
  '🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞',
  '🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕',
  '🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫',
  '🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙',
  '🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦',
  '🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩',
  '🍪','🌰','🧃','🥤','🧋','🥛','🍼'
];

const OBJETOS_EMOJIS = [
  '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱',
  '🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳',
  '🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷',
  '⛸️','🎿','🏎️','🏍️','🛵','🚲','🛴','🚨','🚔','🚍',
  '🚘','🚖','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚',
  '🚛','🚜','🚁','🛸','🚀','🛰️','✈️','🛫','🛬','🪂',
  '⛵','🛥️','🚤','⛴️','🛳️','🚢','⚓','🛟','🚦','🚗',
  '🚃','🚄','🚅','🚆','🚇','🚈','🚉','🚊','🚝','🚞',
  '🚋','🚌','🚍','🚎','🚐'
];

const FORMAS_EMOJIS = [
  '❤️','🩷','🧡','💛','💚','💙','🩵','💜','🤎','🖤',
  '🩶','🤍','💔','❣️','💕','💞','💓','💗','💖','💘',
  '💝','💟','👑','💎','🏆','🥇','🥈','🥉','🏅','🎖️',
  '🏵️','🎗️','🎫','🎟️','🎭','🎨','🎪','🎤','🎧','🎼',
  '🎵','🎶','🎯','🎳','🎮','🎰','🎲','🧩','🧸','🪅',
  '🪆','♠️','♥️','♦️','♣️','🃏','🀄','🎴','🔔','🔕',
  '📣','📢','💬','💭','🗯️','🚩','🏳️','🏴','🏁','🎌',
  '🎁','🎈','🎉','🎊','🧧','🎀','🔮','🧿','🧿','🪄'
];

const CARETAS_EMOJIS = [
  '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃',
  '😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙',
  '😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔',
  '🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥',
  '😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮',
  '🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎',
  '🤓','🧐','😕','😟','🙁','😮','😯','😲','😳','🥺'
];

// Helper to build 500 distinct stickers
const buildStickerLibrary = (): StickerItem[] => {
  const library: StickerItem[] = [];

  const addItems = (
    emojis: string[],
    category: 'animais' | 'natureza' | 'comida' | 'objetos' | 'formas' | 'caretas',
    categoryLabel: string,
    prefix: string
  ) => {
    emojis.forEach((emoji, index) => {
      const id = `st_${prefix}_${index + 1}`;
      let badge: string | undefined = undefined;
      if (index === 0) badge = 'Popular';
      if (index === 3) badge = 'Novo';
      if (index === 7) badge = 'Fofo';
      if (index === 12) badge = 'Mágico';

      library.push({
        id,
        emoji,
        name: `${categoryLabel} ${index + 1}`,
        category,
        categoryLabel,
        badge,
      });
    });
  };

  addItems(ANIMAIS_EMOJIS, 'animais', 'Animal', 'anim');
  addItems(NATUREZA_EMOJIS, 'natureza', 'Natureza', 'nat');
  addItems(COMIDA_EMOJIS, 'comida', 'Comida', 'com');
  addItems(OBJETOS_EMOJIS, 'objetos', 'Objeto', 'obj');
  addItems(FORMAS_EMOJIS, 'formas', 'Forma', 'form');
  addItems(CARETAS_EMOJIS, 'caretas', 'Careta', 'car');

  // Fill up to exactly 500 items if needed by cycling or adding extra fun variations
  const totalSoFar = library.length;
  if (totalSoFar < 500) {
    const extraEmojis = [...ANIMAIS_EMOJIS, ...COMIDA_EMOJIS, ...FORMAS_EMOJIS, ...CARETAS_EMOJIS];
    for (let i = totalSoFar; i < 500; i++) {
      const emoji = extraEmojis[i % extraEmojis.length];
      library.push({
        id: `st_extra_${i + 1}`,
        emoji,
        name: `Adesivo ${i + 1}`,
        category: 'formas',
        categoryLabel: 'Adesivo Especial',
      });
    }
  }

  return library.slice(0, 500);
};

export const STICKER_LIBRARY: StickerItem[] = buildStickerLibrary();
