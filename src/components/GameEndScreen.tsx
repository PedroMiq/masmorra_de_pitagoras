import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GameEndScreenProps {
  isVictory: boolean;
  playerName: string;
  finalScore: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameEndScreen: React.FC<GameEndScreenProps> = ({ 
  isVictory, 
  playerName, 
  finalScore, 
  onRestart, 
  onMainMenu 
}) => {
  const backgroundImage = isVictory ? './images/image2.png' : './images/image3.png';
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-800 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      <Card className="relative z-10 w-full max-w-lg bg-slate-800/95 border-2 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className={`text-4xl font-bold mb-4 ${
            isVictory ? 'text-amber-400' : 'text-red-400'
          }`}>
            {isVictory ? '🏆 VITÓRIA!' : '💀 DERROTA!'}
          </CardTitle>
          
          <div className="text-xl text-slate-300 mb-2">
            {isVictory 
              ? `Parabéns, ${playerName}!` 
              : `Que pena, ${playerName}...`
            }
          </div>
          
          <p className="text-slate-400 text-sm">
            {isVictory 
              ? 'Você conquistou a Masmorra de Pitágoras e derrotou o Mago Supremo!' 
              : 'Você foi derrotado na masmorra. Mas não desista, tente novamente!'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Pontuação Final */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-1">Pontuação Final</div>
                <div className="text-3xl font-bold text-amber-400">{finalScore}</div>
                
                <div className="mt-4 space-y-2">
                  <Badge 
                    variant={finalScore >= 900 ? "default" : finalScore >= 700 ? "secondary" : "destructive"}
                    className="text-sm"
                  >
                    {finalScore >= 900 ? '⭐ Matemático Supremo!' :
                     finalScore >= 700 ? '🎯 Calculista Hábil' :
                     finalScore >= 500 ? '📚 Estudante Dedicado' :
                     '🔢 Aprendiz de Matemática'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="pt-4">
              <div className="text-center text-sm text-slate-300">
                <div className="mb-2">
                  {isVictory 
                    ? '🎉 Você dominou todos os desafios matemáticos!'
                    : '📖 Continue praticando para melhorar suas habilidades!'
                  }
                </div>
                
                <div className="text-xs text-slate-400">
                  {isVictory 
                    ? 'A matemática não tem mais segredos para você!'
                    : 'Cada erro é uma oportunidade de aprender!'
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="space-y-3">
            <Button 
              onClick={onRestart}
              className="w-full bg-amber-600 hover:bg-amber-700 text-slate-900 font-bold py-3"
              size="lg"
            >
              🔄 Jogar Novamente
            </Button>
            
            <Button 
              onClick={onMainMenu}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 py-3"
              size="lg"
            >
              🏠 Menu Principal
            </Button>
          </div>

          {/* Dica Educativa */}
          <Card className="bg-blue-900/30 border-blue-600">
            <CardContent className="pt-4">
              <div className="text-center text-xs text-blue-300">
                <div className="font-semibold mb-1">💡 Dica Matemática</div>
                <div>
                  {isVictory 
                    ? 'Continue praticando diferentes tipos de problemas para manter suas habilidades afiadas!'
                    : 'Lembre-se: a ordem das operações é importante! Parênteses primeiro, depois multiplicação e divisão, por último adição e subtração.'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};