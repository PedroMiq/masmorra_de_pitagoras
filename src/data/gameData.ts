import { Enemy, Item, MathQuestion } from '../types/game';

export const ENEMIES: Enemy[] = [
  // Fase 1: A Masmorra
  {
    id: 'skeleton',
    name: 'Esqueleto',
    health: 4,
    maxHealth: 4,
    damage: 1,
    difficulty: 1,
    description: 'Um esqueleto simples que não possui habilidades especiais.',
    goldReward: 5,
    image: 'skeleton'
  },
  {
    id: 'goblin',
    name: 'Goblin',
    health: 3,
    maxHealth: 3,
    damage: 1,
    difficulty: 2,
    specialAbility: 'steal',
    description: 'Um goblin ganancioso que rouba ouro quando ataca.',
    goldReward: 7,
    image: 'goblin'
  },
  {
    id: 'ogre',
    name: 'O Ogro',
    health: 6,
    maxHealth: 6,
    damage: 2,
    difficulty: 3,
    specialAbility: 'fury',
    description: 'Um ogro que fica furioso quando ferido, atacando automaticamente se você errar.',
    goldReward: 12,
    image: 'ogre'
  },
  // Fase 2: Sala do Trono
  {
    id: 'living_armor',
    name: 'Armadura Viva',
    health: 4,
    maxHealth: 4,
    damage: 2,
    difficulty: 4,
    specialAbility: 'defend',
    description: 'Uma armadura encantada com 20% de chance de defender ataques.',
    goldReward: 15,
    image: 'armor'
  },
  {
    id: 'mimic',
    name: 'Mímico',
    health: 5,
    maxHealth: 5,
    damage: 1,
    difficulty: 5,
    specialAbility: 'treasure',
    description: 'Um baú falso que oferece recompensas perigosas quando derrotado.',
    goldReward: 18,
    image: 'mimic'
  },
  {
    id: 'supreme_mage',
    name: 'O Mago Supremo Da Matemática Divina De Pitágoras',
    health: 8,
    maxHealth: 8,
    damage: 2,
    difficulty: 6,
    specialAbility: 'timer',
    description: 'O chefe final que aumenta seu poder com o tempo.',
    goldReward: 28,
    image: 'mage'
  }
];

export const ITEMS: Item[] = [
  {
    id: 'luck_potion',
    name: 'Poção de Sorte',
    description: 'Dá 20% de chance de acerto crítico (2x de dano)',
    price: 12,
    effect: 'critChance',
    owned: false
  },
  {
    id: 'vitality_potion',
    name: 'Poção de Vitalidade',
    description: 'Aumenta os PV máximos em 2',
    price: 12,
    effect: 'maxHealth',
    owned: false
  },
  {
    id: 'shield',
    name: 'Escudo',
    description: 'Chance de bloquear 1 de dano (10% de chance)',
    price: 18,
    effect: 'blockChance',
    owned: false
  },
  {
    id: 'boots',
    name: 'Botas',
    description: 'Chance de se esquivar de um ataque (10% de chance)',
    price: 25,
    effect: 'dodgeChance',
    owned: false
  }
];

export const generateMathQuestion = (difficulty: number): MathQuestion => {
  let question: string;
  let answer: number;

  switch (difficulty) {
    case 1: // Adição simples
      {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        question = `${a} + ${b}`;
        answer = a + b;
      }
      break;
    case 2: // Subtração simples
      {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * a) + 1;
        question = `${a} - ${b}`;
        answer = a - b;
      }
      break;
    case 3: // Multiplicação simples
      {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        question = `${a} × ${b}`;
        answer = a * b;
      }
      break;
    case 4: // Divisão simples
      {
        const b = Math.floor(Math.random() * 8) + 2;
        const answer_temp = Math.floor(Math.random() * 10) + 1;
        const a = b * answer_temp;
        question = `${a} ÷ ${b}`;
        answer = answer_temp;
      }
      break;
    case 5: // Operações mistas
      {
        const operations = ['+', '-', '×'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        const a = Math.floor(Math.random() * 12) + 3;
        const b = Math.floor(Math.random() * 8) + 2;
        
        if (op === '+') {
          question = `${a} + ${b}`;
          answer = a + b;
        } else if (op === '-') {
          question = `${a} - ${b}`;
          answer = a - b;
        } else {
          question = `${a} × ${b}`;
          answer = a * b;
        }
      }
      break;
    case 6: // Operações complexas
      {
        const a = Math.floor(Math.random() * 15) + 5;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 5) + 1;
        
        const operations = [
          { q: `${a} + ${b} × ${c}`, a: a + (b * c) },
          { q: `(${a} + ${b}) × ${c}`, a: (a + b) * c },
          { q: `${a * c} ÷ ${c} + ${b}`, a: a + b },
          { q: `${a} × ${b} - ${c * 5}`, a: (a * b) - (c * 5) }
        ];
        
        const selected = operations[Math.floor(Math.random() * operations.length)];
        question = selected.q;
        answer = selected.a;
      }
      break;
    default:
      question = '2 + 2';
      answer = 4;
  }

  return { question, answer, difficulty };
};