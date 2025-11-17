import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GameState, BossTimer } from '../types/game';

interface CombatScreenProps {
  gameState: GameState;
  bossTimer: BossTimer;
  onSubmitAnswer: (answer: number) => void;
}

export const CombatScreen: React.FC<CombatScreenProps> = ({ 
  gameState, 
  bossTimer, 
  onSubmitAnswer 
}) => {
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { player, currentEnemy, currentQuestion, combatLog } = gameState;

  const handleSubmit = () => {
    const answer = parseInt(playerAnswer);
    if (!isNaN(answer)) {
      setIsSubmitting(true);
      onSubmitAnswer(answer);
      setPlayerAnswer('');
      
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const getEnemyImage = (enemyId: string) => {
    // Mapear IDs dos inimigos para as imagens disponíveis
    const imageMap: { [key: string]: string } = {
      'skeleton': './images/image4.png',
      'goblin': './images/image5.png',
      'ogre': './images/image6.png',
      'living_armor': './images/image7.png',
      'mimic': './images/image8.png',
      'supreme_mage': './images/image9.png'
    };
    return imageMap[enemyId] || './images/image4.png';
  };

  if (!currentEnemy || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 p-4 flex items-center justify-center">
        <Card className="bg-slate-800/90 border-green-600 w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-400 mb-4">Inimigo Derrotado!</div>
            <div className="text-slate-300">Preparando o próximo combate...</div>
            <div className="mt-4 text-amber-400">Carregando...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Painel do Jogador (left) */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="bg-slate-800/90 border-green-600 h-full">
          <CardHeader>
            <CardTitle className="text-green-400 text-center">{player.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-green-400">Vida</span>
                <span className="text-white">{player.health}/{player.maxHealth}</span>
              </div>
              <Progress 
                value={(player.health / player.maxHealth) * 100} 
                className="h-3"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-center">
                <div className="text-amber-400">Ouro</div>
                <div className="text-white font-bold">{player.gold}</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400">Pontos</div>
                <div className="text-white font-bold">{player.score}</div>
              </div>
            </div>

            {player.items.length > 0 && (
              <div>
                <div className="text-purple-400 text-sm mb-2">Itens:</div>
                <div className="flex flex-wrap gap-1">
                  {player.items.map((item, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Central: enemy (big) and answer input below */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          <Card className="bg-slate-800/90 border-red-600 h-[520px] flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-red-400 text-center text-3xl">{currentEnemy.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center px-6">
              <div className="w-full flex items-center justify-between gap-6">
                {/* Enemy image */}
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={getEnemyImage(currentEnemy.id)}
                    alt={currentEnemy.name}
                    className="w-60 h-60 lg:w-72 lg:h-72 rounded-lg object-contain object-center shadow-lg"
                  />
                </div>

                {/* Right side: health and info */}
                <div className="w-1/3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-red-400 font-semibold">Vida</div>
                    <div className="text-white font-bold">{currentEnemy.health}/{currentEnemy.maxHealth}</div>
                  </div>
                  <Progress value={(currentEnemy.health / currentEnemy.maxHealth) * 100} className="h-4 mb-4" />
                  <div className="text-center text-orange-400 font-semibold mb-3">Dano: {currentEnemy.damage}</div>
                  {currentEnemy.specialAbility && (
                    <Badge variant="destructive" className="mt-2">Habilidade Especial</Badge>
                  )}
                  <div className="text-xs text-slate-400 mt-6">{currentEnemy.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Answer area under enemy */}
          <Card className="bg-slate-800/90 border-amber-600">
            <CardHeader>
              {gameState.gameStatus === 'combat' && bossTimer.maxTime > 0 && (
                <div className="text-center mb-3">
                  <div className={`text-xs mb-1 font-bold tracking-widest ${bossTimer.isBoss ? 'text-red-400' : 'text-orange-400'}`}>
                    {bossTimer.isBoss ? '⏱️ TEMPO DO CHEFE' : '⏱️ TEMPO PARA RESPONDER'}
                  </div>
                  <Progress value={(bossTimer.timeLeft / bossTimer.maxTime) * 100} className="h-3 mb-2" />
                  <div className={`text-2xl font-bold ${bossTimer.timeLeft < 3 ? 'text-red-500 animate-pulse' : bossTimer.isBoss ? 'text-red-400' : 'text-orange-400'}`}>{bossTimer.timeLeft.toFixed(1)}s</div>
                </div>
              )}
              <CardTitle className="text-amber-400 text-center">{currentQuestion.question} = ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Input type="number" value={playerAnswer} onChange={(e) => setPlayerAnswer(e.target.value)} placeholder="Sua resposta" className="bg-slate-700 border-slate-600 text-white text-center text-xl w-2/3" disabled={isSubmitting} onKeyPress={(e) => e.key === 'Enter' && handleSubmit()} />
                <Button onClick={handleSubmit} disabled={!playerAnswer || isSubmitting} className="bg-amber-600 hover:bg-amber-700 text-slate-900 font-bold px-8">{isSubmitting ? 'Atacando...' : 'Atacar!'}</Button>
              </div>
              <div className="text-center text-slate-400 text-sm">Dificuldade: {currentQuestion.difficulty}</div>
            </CardContent>
          </Card>
        </div>

        {/* Right: live chat style log */}
        <div className="col-span-12 lg:col-span-3">
          <Card className="bg-slate-800/90 border-slate-600 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-slate-300 text-lg">Log de Combate</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              <div className="h-[72vh] overflow-y-auto p-4 bg-slate-900" style={{display: 'flex', flexDirection: 'column-reverse'}}>
                {/* Render reversed so newest appear at bottom like chat; container uses column-reverse */}
                {combatLog.slice().reverse().map((log, index) => (
                  <div key={index} className="bg-slate-800/70 rounded mb-2 p-3 text-slate-200 text-sm">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* bottom log removed (moved to right-side chat) */}
    </div>
  );
};