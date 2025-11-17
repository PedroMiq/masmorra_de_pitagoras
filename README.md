# Masmorra de Pitágoras

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white) ![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)

## Escopo do Projeto

**Descrição:** Jogo educativo de RPG que mistura combate baseado em perguntas matemáticas com elementos de progressão (itens, moedas, mercador e chefes). O jogador responde questões para atacar inimigos; falhas ou tempo esgotado fazem o inimigo atacar.  
**Objetivo:** Tornar o aprendizado de matemática mais divertido por meio de mecânicas de jogo simples, desafios progressivos e recompensas.

## Tecnologias Usadas
- **Frontend:** React + TypeScript
- **Build / Dev server:** Vite
- **Estilização:** Tailwind CSS
- **Storage:** localStorage (salvamento de progresso)
- **Outras libs:** @radix-ui, react-router-dom, sonner (notificações), entre outras listadas em `package.json`

## Pré-requisitos
- **Node.js:** versão LTS (recomendado >= 18). Verifique com `node -v`.
- **Gerenciador de pacotes:** `npm` (vem com Node) ou `pnpm` (opcional). O repositório contém `pnpm-lock.yaml`, então `pnpm` funciona bem.
- **Windows:** PowerShell (instruções de comando abaixo são para PowerShell).

## Como instalar e executar (desenvolvimento)
- Abra um terminal na pasta do projeto (`caminho/para/masmorra_de_pitagoras`), por exemplo:

```powershell
cd C:\path\jogo_rpg_matematica
```

- Instale dependências com `npm`:

```powershell
npm install
# ou, se preferir pnpm:
pnpm install
```

- Inicie o servidor de desenvolvimento (Vite):

```powershell
npm run dev
# ou com pnpm
pnpm run dev
```

- Abra no navegador o endereço indicado pelo Vite (ex.: `http://localhost:5173` ou `http://localhost:8081` dependendo da máquina).

**Build e preview**
- Gerar build de produção:

```powershell
npm run build
```

- Servir o build para testar preview:

```powershell
npm run preview
```

## Principais Funcionalidades
- **Combate baseado em perguntas:** responda perguntas matemáticas para causar dano.
- **Timer de combate:** cada inimigo tem um tempo para responder; o tempo esgotado faz o inimigo agir.
- **Sistema de itens/mercador:** compre itens com ouro entre batalhas.
- **Inimigos especiais:** Mímico com chance de dropar item, ogro com fury, etc.
- **Persistência:** progresso salvo no `localStorage` (chave: `pythagorasDungeon_save`).

## Como jogar (resumo rápido)
- Comece um novo jogo pelo menu principal.
- Enfrente inimigos respondendo a perguntas exibidas na tela.
- Ganhe ouro e compre itens no mercador entre fases.
- Prossiga até enfrentar o Mago Supremo (chefe final).

**Recuperar / resetar progresso**
- Para limpar o save local (útil se algo travar), abra o console do navegador e execute:

```javascript
localStorage.removeItem('pythagorasDungeon_save');
location.reload();
```

## Estrutura do Repositório (resumo)
- `src/engine/GameEngine.ts`: lógica do jogo, timer, persistência.
- `src/components`: componentes React (CombatScreen, MerchantScreen, MainMenu, etc.).
- `src/data/gameData.ts`: definição de inimigos, itens e gerador de perguntas.
- `src/pages/Index.tsx`: integração entre `GameEngine` e UI.
- `public/` e `src/assets` (imagens e arquivos estáticos).

## Links úteis
- Vite: https://vitejs.dev/
- React: https://reactjs.org/
- Tailwind CSS: https://tailwindcss.com/
- Radix UI: https://www.radix-ui.com/

## Equipe do Projeto
- **Pedro Henrique Miquelin** - [@PedroMiq](https://github.com/PedroMiq)
- **Luis Felipe Mafort**
- **Matheus Urizzi da Paixão**
- **Lucas Ramiro Quesada**