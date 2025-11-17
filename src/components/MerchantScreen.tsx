import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GameState } from '../types/game';
import { ITEMS } from '../data/gameData';

interface MerchantScreenProps {
  gameState: GameState;
  onBuyItem: (itemId: string) => boolean;
  onLeaveMerchant: () => void;
}

export const MerchantScreen: React.FC<MerchantScreenProps> = ({ 
  gameState, 
  onBuyItem, 
  onLeaveMerchant 
}) => {
  const { player } = gameState;

  const handleBuyItem = (itemId: string) => {
    const success = onBuyItem(itemId);
    if (!success) {
      // Mostrar feedback de erro se necessário
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-amber-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabeçalho */}
        <Card className="mb-6 bg-slate-800/90 border-amber-600">
          <CardHeader>
            <CardTitle className="text-amber-400 text-center text-2xl">
              🏪 Mercador Misterioso
            </CardTitle>
            <p className="text-slate-300 text-center">
              "Bem-vindo, bravo aventureiro! Tenho itens especiais que podem ajudá-lo em sua jornada..."
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-amber-400 text-sm">Seu Ouro</div>
                <div className="text-white text-xl font-bold">{player.gold} 🪙</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Vida</div>
                <div className="text-white text-xl font-bold">{player.health}/{player.maxHealth} ❤️</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loja de Itens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {ITEMS.map((item) => (
            <Card key={item.id} className="bg-slate-800/90 border-purple-600">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-purple-400 text-lg">{item.name}</CardTitle>
                  <Badge 
                    variant={item.owned ? "secondary" : "default"}
                    className="bg-amber-600 text-slate-900"
                  >
                    {item.price} 🪙
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4">{item.description}</p>
                
                <Button
                  onClick={() => handleBuyItem(item.id)}
                  disabled={item.owned || player.gold < item.price}
                  className={`w-full ${
                    item.owned 
                      ? 'bg-gray-600 text-gray-400' 
                      : player.gold >= item.price
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {item.owned ? 'Já Possui' : 
                   player.gold >= item.price ? 'Comprar' : 'Ouro Insuficiente'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Itens Possuídos */}
        {player.items.length > 0 && (
          <Card className="mb-6 bg-slate-800/90 border-green-600">
            <CardHeader>
              <CardTitle className="text-green-400">Seus Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {player.items.map((item, index) => (
                  <Badge key={index} variant="secondary" className="p-2 text-center">
                    {item.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas do Jogador */}
        <Card className="mb-6 bg-slate-800/90 border-blue-600">
          <CardHeader>
            <CardTitle className="text-blue-400">Suas Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-red-400 text-sm">Dano</div>
                <div className="text-white text-lg font-bold">{player.damage}</div>
              </div>
              <div>
                <div className="text-orange-400 text-sm">Crítico</div>
                <div className="text-white text-lg font-bold">{player.critChance}%</div>
              </div>
              <div>
                <div className="text-blue-400 text-sm">Bloqueio</div>
                <div className="text-white text-lg font-bold">{player.blockChance}%</div>
              </div>
              <div>
                <div className="text-green-400 text-sm">Esquiva</div>
                <div className="text-white text-lg font-bold">{player.dodgeChance}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão para Continuar */}
        <Card className="bg-slate-800/90 border-amber-600">
          <CardContent className="pt-6">
            <Button 
              onClick={onLeaveMerchant}
              className="w-full bg-amber-600 hover:bg-amber-700 text-slate-900 font-bold py-3 text-lg"
            >
              Continuar para a Sala do Trono 👑
            </Button>
            <p className="text-slate-400 text-center text-sm mt-2">
              Sua vida será restaurada completamente ao continuar
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};