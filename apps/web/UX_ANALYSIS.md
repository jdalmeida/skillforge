# Análise de UX: Skillforge

## Visão Geral
Esta análise cobre a jornada do usuário desde a Landing Page até o jogo principal, identificando pontos de atrito e inconsistências na experiência atual.

## Problemas Identificados

### 1. HUD Onipresente (Crítico)
O componente `GameHUD` (barra de status e navegação) está inserido no layout global (`apps/web/src/app/layout.tsx`).
- **Problema**: Ele aparece na **Landing Page** e na **Tela de Login**.
- **Impacto**: Usuários novos veem informações de jogo ("Level 5", XP) antes de criar conta, o que quebra a imersão e polui a interface de marketing.

### 2. Fluxo de Navegação Inconsistente
- **Landing Page**: O botão principal ("Enter the Simulation") leva para `/map`.
- **Login**: O redirecionamento pós-login leva para `/dashboard`.
- **Conflito**: O usuário que clica no CTA da home espera ver o mapa, mas se precisar logar, acaba no dashboard, perdendo o contexto.

### 3. Proteção de Rotas
- **Dashboard**: Protegido no servidor (`redirect('/login')`).
- **Map**: Componente cliente sem verificação explícita de sessão visível no código inicial.
- **Risco**: Acesso não autorizado à interface do jogo.

### 4. Feedback de Estado
- O HUD exibe dados estáticos (mockados) que não refletem o estado real do usuário (ex: sempre mostra Nível 5).

## Recomendações

1.  **Renderização Condicional do HUD**:
    - Ocultar o HUD nas rotas `/` (Landing) e `/login`.
    - Exibir apenas nas rotas de jogo (`/map`, `/dashboard`, `/inventory`, etc.).

2.  **Unificação do Ponto de Entrada**:
    - Definir `/map` como a "Home" do jogo pós-login para manter a consistência com o CTA da Landing Page.
    - Ajustar o redirecionamento do Login.

3.  **Middleware de Autenticação**:
    - Implementar proteção global via Middleware para rotas privadas.

4.  **Dados Reais no HUD**:
    - Conectar o HUD ao estado do usuário (Sessão/DB).
