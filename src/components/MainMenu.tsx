import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MainMenuProps {
  onStartGame: (playerName: string) => void;
  onLoadGame: () => void;
  hasExistingSave: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onLoadGame, hasExistingSave }) => {
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleNewGame = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('./images/image.png')] bg-cover bg-center opacity-30"></div>
      
      <Card className="relative z-10 w-full max-w-md bg-slate-800/90 border-amber-600 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-amber-400 mb-2">
            A Masmorra de Pitágoras
          </CardTitle>
          <p className="text-slate-300 text-sm">
            Batalhe com a matemática e conquiste a vitória!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!showNameInput ? (
            <>
              <Button 
                onClick={() => setShowNameInput(true)}
                className="w-full bg-amber-600 hover:bg-amber-700 text-slate-900 font-semibold py-3"
                size="lg"
              >
                Novo Jogo
              </Button>
              
              {hasExistingSave && (
                <Button 
                  onClick={onLoadGame}
                  variant="outline"
                  className="w-full border-amber-600 text-amber-400 hover:bg-amber-600 hover:text-slate-900 py-3"
                  size="lg"
                >
                  Continuar Jogo
                </Button>
              )}
              
              <div className="text-center text-slate-400 text-xs mt-6">
                <p>Use as setas do teclado ou clique para navegar</p>
                <p>Resolva problemas matemáticos para atacar!</p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-amber-400 text-sm font-medium mb-2">
                  Digite seu nome:
                </label>
                <Input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Nome do herói"
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  maxLength={20}
                  onKeyPress={(e) => e.key === 'Enter' && handleNewGame()}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleNewGame}
                  disabled={!playerName.trim()}
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-slate-900 font-semibold"
                >
                  Começar Aventura
                </Button>
                <Button 
                  onClick={() => setShowNameInput(false)}
                  variant="outline"
                  className="border-slate-600 text-slate-400 hover:bg-slate-700"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};