import React, { useState, useEffect } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { MainMenu } from '../components/MainMenu';
import { CombatScreen } from '../components/CombatScreen';
import { MerchantScreen } from '../components/MerchantScreen';
import { GameEndScreen } from '../components/GameEndScreen';
import { GameState, BossTimer } from '../types/game';

const Index = () => {
  const [gameEngine] = useState(() => new GameEngine());
  const [gameState, setGameState] = useState<GameState>(gameEngine.getGameState());
  const [bossTimer, setBossTimer] = useState<BossTimer>(gameEngine.getBossTimer());
  const [hasExistingSave, setHasExistingSave] = useState(false);

  useEffect(() => {
    // Verificar se existe save
    const saved = localStorage.getItem('pythagorasDungeon_save');
    setHasExistingSave(!!saved);
  }, []);

  useEffect(() => {
    // Poll engine state frequently so UI stays in sync (handles transitions like next battle/merchant)
    const interval = setInterval(() => {
      const engineState = gameEngine.getGameState();
      const engineTimer = gameEngine.getBossTimer();

      // Only decrement timer while in combat
      if (engineState.gameStatus === 'combat' && engineTimer.maxTime > 0) {
        gameEngine.updateBossTimer();
      }

      // Always refresh local state from engine so transitions (e.g. to merchant) are reflected
      setGameState(gameEngine.getGameState());
      setBossTimer(gameEngine.getBossTimer());
    }, 100);

    return () => clearInterval(interval);
  }, [gameEngine]);

  const handleStartNewGame = (playerName: string) => {
    gameEngine.resetGame();
    gameEngine.setPlayerName(playerName);
    gameEngine.startGame();
    setGameState(gameEngine.getGameState());
    setBossTimer(gameEngine.getBossTimer());
    setHasExistingSave(false);
  };

  const handleLoadGame = () => {
    setGameState(gameEngine.getGameState());
    setBossTimer(gameEngine.getBossTimer());
  };

  const handleSubmitAnswer = (answer: number) => {
    gameEngine.submitAnswer(answer);
    setGameState(gameEngine.getGameState());
    setBossTimer(gameEngine.getBossTimer());
  };

  const handleBuyItem = (itemId: string): boolean => {
    const success = gameEngine.buyItem(itemId);
    setGameState(gameEngine.getGameState());
    return success;
  };

  const handleLeaveMerchant = () => {
    gameEngine.leaveMerchant();
    setGameState(gameEngine.getGameState());
  };

  const handleRestart = () => {
    gameEngine.resetGame();
    localStorage.removeItem('pythagorasDungeon_save');
    setGameState(gameEngine.getGameState());
    setBossTimer(gameEngine.getBossTimer());
    setHasExistingSave(false);
  };

  const handleMainMenu = () => {
    gameEngine.resetGame();
    setGameState(gameEngine.getGameState());
    setBossTimer(gameEngine.getBossTimer());
    setHasExistingSave(false);
  };

  // Renderizar a tela apropriada baseada no estado do jogo
  switch (gameState.gameStatus) {
    case 'menu':
      return (
        <MainMenu 
          onStartGame={handleStartNewGame}
          onLoadGame={handleLoadGame}
          hasExistingSave={hasExistingSave}
        />
      );
    
    case 'combat':
      return (
        <CombatScreen 
          gameState={gameState}
          bossTimer={bossTimer}
          onSubmitAnswer={handleSubmitAnswer}
        />
      );
    
    case 'merchant':
      return (
        <MerchantScreen 
          gameState={gameState}
          onBuyItem={handleBuyItem}
          onLeaveMerchant={handleLeaveMerchant}
        />
      );
    
    case 'victory':
      return (
        <GameEndScreen 
          isVictory={true}
          playerName={gameState.player.name}
          finalScore={gameState.player.score}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      );
    
    case 'defeat':
      return (
        <GameEndScreen 
          isVictory={false}
          playerName={gameState.player.name}
          finalScore={gameState.player.score}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      );
    
    default:
      return (
        <MainMenu 
          onStartGame={handleStartNewGame}
          onLoadGame={handleLoadGame}
          hasExistingSave={hasExistingSave}
        />
      );
  }
};

export default Index;
