import { GameState, Player, Enemy, BossTimer } from '../types/game';
import { ENEMIES, ITEMS, generateMathQuestion } from '../data/gameData';

export class GameEngine {
  private gameState: GameState;
  private bossTimer: BossTimer;
  private saveKey = 'pythagorasDungeon_save';

  constructor() {
    this.bossTimer = { active: false, timeLeft: 0, maxTime: 10 };
    // loadGame will attempt to restore both gameState and bossTimer (backwards-compatible)
    const loaded = this.loadGame();
    if (loaded) {
      this.gameState = loaded.gameState;
      this.bossTimer = loaded.bossTimer;
    } else {
      this.gameState = this.createNewGame();
    }
  }

  createNewGame(): GameState {
    const player: Player = {
      name: '',
      health: 10,
      maxHealth: 10,
      damage: 1,
      gold: 0,
      score: 1000,
      items: [],
      critChance: 0,
      blockChance: 0,
      dodgeChance: 0
    };

    return {
      player,
      currentEnemy: null,
      currentPhase: 'dungeon',
      currentEnemyIndex: 0,
      gameStatus: 'menu',
      currentQuestion: null,
      combatLog: []
      , visitedFinalMerchant: false
    };
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getBossTimer(): BossTimer {
    return { ...this.bossTimer };
  }

  setPlayerName(name: string): void {
    this.gameState.player.name = name;
    this.saveGame();
  }

  startGame(): void {
    this.gameState.gameStatus = 'playing';
    this.startNextBattle();
  }

  startNextBattle(): void {
    const enemyIndex = this.gameState.currentEnemyIndex;
    let enemy: Enemy;

    if (this.gameState.currentPhase === 'dungeon') {
      if (enemyIndex >= 3) {
        // Completou a masmorra, vai para o mercador
        this.gameState.currentPhase = 'merchant';
        this.gameState.gameStatus = 'merchant';
        this.gameState.player.health = this.gameState.player.maxHealth; // Cura completa
        this.saveGame();
        return;
      }
      enemy = { ...ENEMIES[enemyIndex] };
    } else if (this.gameState.currentPhase === 'throne') {
      if (enemyIndex >= 6) {
        // Jogo completo!
        this.gameState.gameStatus = 'victory';
        this.saveGame();
        return;
      }

      // Se chegou no Mago Supremo (índice 5) e ainda NÃO visitou o mercante final,
      // mostra o mercante uma vez antes do confronto final. Se já visitou,
      // procede normalmente para iniciar o combate com o boss.
      if (enemyIndex === 5 && !this.gameState.visitedFinalMerchant) {
        this.gameState.gameStatus = 'merchant';
        this.gameState.player.health = this.gameState.player.maxHealth; // Cura completa
        // Marcar que o mercante final já foi mostrado para não entrar em loop
        this.gameState.visitedFinalMerchant = true;
        this.saveGame();
        return;
      }

      enemy = { ...ENEMIES[enemyIndex] };
    } else {
      return;
    }

    this.gameState.currentEnemy = enemy;
    this.gameState.gameStatus = 'combat';
    this.gameState.currentQuestion = generateMathQuestion(enemy.difficulty);
    this.gameState.combatLog = [`Você encontrou ${enemy.name}!`];

    // Inicializar timer para todos os inimigos (15s normais, 10s para boss)
    const isBoss = enemy.specialAbility === 'timer';
    const timerDuration = isBoss ? 10 : 15;
    this.bossTimer = { active: true, timeLeft: timerDuration, maxTime: timerDuration, isBoss };

    this.saveGame();
  }

  submitAnswer(playerAnswer: number): boolean {
    if (!this.gameState.currentQuestion || !this.gameState.currentEnemy) {
      return false;
    }

    const isCorrect = playerAnswer === this.gameState.currentQuestion.answer;
    
    if (isCorrect) {
      this.playerAttack();
    } else {
      this.enemyAttack();
    }

    // Verificar se o inimigo foi derrotado (HP <= 0)
    if (this.gameState.currentEnemy.health <= 0) {
      this.enemyDefeated();
    } else if (this.gameState.player.health <= 0) {
      this.gameState.gameStatus = 'defeat';
    } else {
      // Continuar combate - resetar timer
      this.bossTimer.timeLeft = this.bossTimer.maxTime;
      this.gameState.currentQuestion = generateMathQuestion(this.gameState.currentEnemy.difficulty);
    }

    this.saveGame();
    return isCorrect;
  }

  private playerAttack(): void {
    if (!this.gameState.currentEnemy) return;

    let damage = this.gameState.player.damage;
    let isCrit = false;

    // Verificar crítico
    if (Math.random() < this.gameState.player.critChance / 100) {
      damage *= 2;
      isCrit = true;
    }

    // Verificar defesa do inimigo (Armadura Viva)
    if (this.gameState.currentEnemy.specialAbility === 'defend' && Math.random() < 0.2) {
      damage = Math.max(0, damage - 1);
      this.gameState.combatLog.push(`${this.gameState.currentEnemy.name} defendeu o ataque!`);
    }

    this.gameState.currentEnemy.health -= damage;
    
    const critText = isCrit ? ' (CRÍTICO!)' : '';
    this.gameState.combatLog.push(`Você causou ${damage} de dano${critText}!`);

    // Habilidade especial do Ogro (fury)
    if (this.gameState.currentEnemy.specialAbility === 'fury' && this.gameState.currentEnemy.health > 0) {
      this.gameState.combatLog.push(`${this.gameState.currentEnemy.name} ficou furioso!`);
    }
  }

  private enemyAttack(): void {
    if (!this.gameState.currentEnemy) return;

    // Verificar esquiva
    if (Math.random() < this.gameState.player.dodgeChance / 100) {
      this.gameState.combatLog.push('Você se esquivou do ataque!');
      return;
    }

    let damage = this.gameState.currentEnemy.damage;

    // Verificar bloqueio
    if (Math.random() < this.gameState.player.blockChance / 100) {
      damage = Math.max(0, damage - 1);
      this.gameState.combatLog.push('Você bloqueou parte do ataque!');
    }

    this.gameState.player.health -= damage;
    this.gameState.player.score = Math.max(0, this.gameState.player.score - 50);
    
    this.gameState.combatLog.push(`${this.gameState.currentEnemy.name} causou ${damage} de dano!`);

    // Habilidade especial do Goblin (steal)
    if (this.gameState.currentEnemy.specialAbility === 'steal') {
      const stolenGold = Math.floor(Math.random() * 3) + 1;
      this.gameState.player.gold = Math.max(0, this.gameState.player.gold - stolenGold);
      this.gameState.combatLog.push(`${this.gameState.currentEnemy.name} roubou ${stolenGold} moedas!`);
    }
  }

  private enemyDefeated(): void {
    if (!this.gameState.currentEnemy) return;

    const goldReward = this.gameState.currentEnemy.goldReward;
    this.gameState.player.gold += goldReward;
    this.gameState.combatLog.push(`${this.gameState.currentEnemy.name} foi derrotado!`);
    this.gameState.combatLog.push(`Você ganhou ${goldReward} moedas de ouro!`);

    // Habilidade especial do Mímico: chance de dropar um item gratuito
    if (this.gameState.currentEnemy.specialAbility === 'treasure') {
      // Tenta dropar um item não-possuído (60% de chance)
      const availableItems = ITEMS.filter(i => !i.owned);
      if (availableItems.length > 0 && Math.random() < 0.6) {
        const item = availableItems[Math.floor(Math.random() * availableItems.length)];
        item.owned = true;
        this.gameState.player.items.push({ ...item });
        this.gameState.combatLog.push(`O Mímico deixou cair: ${item.name}! Você obteve um item gratuito.`);
      } else {
        // Se não houver item ou falhar no drop, dar um bônus de ouro modestamente
        const bonus = Math.floor(Math.random() * 5) + 3; // 3-7 de ouro
        this.gameState.player.gold += bonus;
        this.gameState.combatLog.push(`O Mímico não tinha itens, mas você encontrou ${bonus} moedas de ouro.`);
      }
    }

    this.gameState.currentEnemyIndex++;
    this.bossTimer.active = false;
    this.gameState.currentEnemy = null;
    this.gameState.currentQuestion = null;
    this.saveGame();

    // Pequena pausa antes do próximo inimigo
    setTimeout(() => {
      this.startNextBattle();
      this.saveGame();
    }, 2000);
  }

  buyItem(itemId: string): boolean {
    const item = ITEMS.find(i => i.id === itemId);
    if (!item || item.owned || this.gameState.player.gold < item.price) {
      return false;
    }

    this.gameState.player.gold -= item.price;
    item.owned = true;
    this.gameState.player.items.push({ ...item });

    // Aplicar efeito do item
    switch (item.effect) {
      case 'critChance':
        this.gameState.player.critChance += 20;
        break;
      case 'maxHealth':
        this.gameState.player.maxHealth += 2;
        this.gameState.player.health += 2;
        break;
      case 'blockChance':
        this.gameState.player.blockChance += 10;
        break;
      case 'dodgeChance':
        this.gameState.player.dodgeChance += 10;
        break;
    }

    this.saveGame();
    return true;
  }

  leaveMerchant(): void {
    // Ao sair do mercante, decidir onde começar:
    // - Se currentEnemyIndex >= 5 (ou seja, já avançamos até o boss), iniciar no boss (índice 5)
    // - Caso contrário, iniciar na sala do trono (índice 3)
    this.gameState.currentPhase = 'throne';
    if (this.gameState.currentEnemyIndex >= 5) {
      this.gameState.currentEnemyIndex = 5; // Mago Supremo
    } else {
      this.gameState.currentEnemyIndex = 3; // Armadura Viva
    }
    this.startNextBattle();
  }

  updateBossTimer(): void {
    if (!this.bossTimer.active) return;

    // decrement with clamping and rounding to avoid floating point drift
    const prev = this.bossTimer.timeLeft;
    const next = Math.max(0, +(this.bossTimer.timeLeft - 0.1).toFixed(1));
    this.bossTimer.timeLeft = next;

    // If we crossed to zero, handle timeout once
    if (prev > 0 && next === 0) {
      if (!this.gameState.currentEnemy) {
        // nothing to do
        this.saveGame();
        return;
      }

      if (this.bossTimer.isBoss) {
        // Boss: aumentar dano
        this.gameState.currentEnemy.damage += 1;
        this.gameState.combatLog.push('O Mago Supremo ficou mais poderoso!');
      } else {
        // Inimigos normais: aplicar dano ao jogador
        this.enemyAttack();
        this.gameState.combatLog.push('Tempo esgotado! O inimigo atacou!');

        // Verificar se o jogador foi derrotado
        if (this.gameState.player.health <= 0) {
          this.gameState.gameStatus = 'defeat';
          this.saveGame();
          return;
        }
      }

      // gerar nova pergunta e resetar o timer
      this.gameState.currentQuestion = generateMathQuestion(this.gameState.currentEnemy.difficulty);
      this.bossTimer.timeLeft = this.bossTimer.maxTime;
      this.saveGame();
    }
  }

  saveGame(): void {
    // Persist both gameState and bossTimer so timer resumes correctly after reload
    try {
      const payload = { gameState: this.gameState, bossTimer: this.bossTimer };
      localStorage.setItem(this.saveKey, JSON.stringify(payload));
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  }

  loadGame(): { gameState: GameState; bossTimer: BossTimer } | null {
    const saved = localStorage.getItem(this.saveKey);
    if (!saved) return null;

    try {
      const parsed = JSON.parse(saved);

      // New format: { gameState, bossTimer }
      if (parsed && parsed.gameState) {
        // Ensure bossTimer shape
        const bt: BossTimer = parsed.bossTimer || { active: false, timeLeft: 0, maxTime: 10 };
        return { gameState: parsed.gameState as GameState, bossTimer: bt };
      }

      // Backwards compatibility: older saves only had GameState
      const oldState = parsed as GameState;
      // If the save was mid-combat, initialize a fresh bossTimer for that enemy
      if (oldState.currentEnemy && oldState.gameStatus === 'combat') {
        const isBoss = oldState.currentEnemy.specialAbility === 'timer';
        const timerDuration = isBoss ? 10 : 15;
        const bt: BossTimer = { active: true, timeLeft: timerDuration, maxTime: timerDuration, isBoss };
        return { gameState: oldState, bossTimer: bt };
      }

      return { gameState: oldState, bossTimer: { active: false, timeLeft: 0, maxTime: 10 } };
    } catch (e) {
      console.error('Failed to load save:', e);
      return null;
    }
  }

  resetGame(): void {
    localStorage.removeItem(this.saveKey);
    this.gameState = this.createNewGame();
  }
}