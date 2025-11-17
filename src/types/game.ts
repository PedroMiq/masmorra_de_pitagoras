export interface Player {
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  gold: number;
  score: number;
  items: Item[];
  critChance: number;
  blockChance: number;
  dodgeChance: number;
}

export interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  difficulty: number;
  specialAbility?: string;
  description: string;
  goldReward: number;
  image?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  effect: string;
  owned: boolean;
}

export interface MathQuestion {
  question: string;
  answer: number;
  difficulty: number;
}

export interface GameState {
  player: Player;
  currentEnemy: Enemy | null;
  currentPhase: 'dungeon' | 'throne' | 'merchant' | 'complete';
  currentEnemyIndex: number;
  gameStatus: 'menu' | 'playing' | 'combat' | 'merchant' | 'victory' | 'defeat';
  currentQuestion: MathQuestion | null;
  combatLog: string[];
  visitedFinalMerchant?: boolean;
}

export interface BossTimer {
  active: boolean;
  timeLeft: number;
  maxTime: number;
  isBoss?: boolean;
}