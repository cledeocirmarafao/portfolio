<div align="center">

# &lt;MarafaDev/&gt;

**Portfólio pessoal de Cledeocir Marafão(eu) - Desenvolvedor Frontend Jr com foco em Fullstack**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://www.cledeocirmarafao.com.br)
[![Backend](https://img.shields.io/badge/backend-railway-blueviolet?style=for-the-badge&logo=railway)](https://railway.app)
[![Tests](https://img.shields.io/badge/testes-223%20passing-brightgreen?style=for-the-badge&logo=vitest)](./src)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![i18n](https://img.shields.io/badge/i18n-PT%20%7C%20EN-00f5ff?style=for-the-badge)](./src/locales)

[**🌐 Ver online**](https://www.cledeocirmarafao.com.br) · [**💼 LinkedIn**](https://www.linkedin.com/in/cledeocirmarafao/) · [**🐙 GitHub**](https://github.com/cledeocirmarafao)

</div>

---

## ✨ Visão Geral

Portfólio desenvolvido do zero com foco em **performance**, **acessibilidade** e **experiência de usuário**. Vai além de um currículo online, é uma aplicação completa com animações 3D, mini-game interativo, mapa integrado, chatbot com IA e suporte a dois idiomas.

---

## 🚀 Features

| Feature | Descrição |
|---|---|
| 🎬 **Intro Animation** | Animação de entrada com efeito glitch e barra de progresso |
| 🌐 **i18n PT/EN** | Alternância de idioma em tempo real sem reload |
| 🎮 **Pulse Runner** | Mini-game endless runner integrado ao formulário de contato |
| 🤖 **Chatbot com IA** | Assistente virtual treinado com contexto profissional via Groq + Llama 3.3 |
| 🧊 **Cenas 3D** | Geometrias flutuantes e campo de partículas com React Three Fiber |
| 🗺️ **Mapa Interativo** | Localização em Florianópolis via Mapbox GL |
| 📊 **GitHub Graph** | Gráfico de contribuições do último ano em tempo real |
| 📱 **Totalmente responsivo** | Mobile-first, com menu adaptativo e breakpoints cuidadosos |
| ♿ **Acessibilidade** | ARIA labels, semântica correta, navegação por teclado |

---

## 🧱 Stack

### Frontend

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI principal |
| TypeScript | ~5.9 | Tipagem estática strict |
| Vite | 7 | Build & dev server |
| Tailwind CSS | v4 | Estilização utilitária |
| Motion (Framer) | 12 | Animações declarativas |
| React Three Fiber | 9 | Cenas 3D |
| @react-three/drei | 10 | Helpers Three.js |
| i18next + react-i18next | 25 | Internacionalização |
| react-markdown | 10 | Renderização de Markdown no chatbot |
| Mapbox GL | 3 | Mapa interativo |
| EmailJS | 4 | Envio de formulário sem backend |
| React Router DOM | 7 | Roteamento |
| Axios | 1 | Requisições HTTP |
| Lucide React | 0.577 | Ícones |
| react-icons | 5 | Ícones complementares |
| shadcn/ui | 3.8 | Componentes base (Button, Input, Textarea) |

### Backend (Chatbot API)

| Tecnologia | Versão | Uso |
|---|---|---|
| Hono | 4 | Framework HTTP minimalista |
| @hono/node-server | 1 | Servidor Node.js |
| Groq SDK | 0.9 | Inferência com Llama 3.3 70B |
| dotenv | 16 | Variáveis de ambiente |
| tsx | 4 | Execução TypeScript |

### Testes

| Tecnologia | Uso |
|---|---|
| Vitest | Test runner |
| Testing Library React | Renderização e queries |
| Testing Library Jest DOM | Matchers customizados |
| jsdom | Ambiente de browser simulado |

---

## 🧪 Testes

O projeto conta com **223 testes unitários** distribuídos por todos os componentes e hooks críticos, garantindo cobertura em renderização, comportamento, acessibilidade e integração.

```bash
# Rodar todos os testes
npm run test

# Rodar com UI interativa
npm run test -- --ui

# Rodar com cobertura
npm run test -- --coverage
```

### Cobertura por módulo

| Módulo | Testes | O que cobre |
|---|---|---|
| `AboutSection` | ✅ | Renderização, badges, timeline, gráfico |
| `ChatBot` | ✅ | Abertura, envio de mensagem, markdown, quick replies |
| `ContactForm` | ✅ | Campos, validação, spinner, status, game boost |
| `ContactSection` | ✅ | Links sociais, hrefs, clipboard, copy icon |
| `Footer` | ✅ | Logo, nav links, social links, scroll to top |
| `GithubContributionGraph` | ✅ | Total, meses, legenda, cells, período |
| `HardSkillsSection` | ✅ | 14 tecnologias × 3 cópias, carrossel, hover/pause |
| `HeroSection` | ✅ | Heading, tagline, CTAs, stats, code card, Scene3D |
| `IntroAnimation` | ✅ | Typewriter, stages, barra de progresso, onComplete |
| `LocationMap` | ✅ | Container, título, cidade, link Google Maps |
| `Navigation` | ✅ | Desktop/mobile menu, links, scroll, active state |
| `ProjectsSection` | ✅ | 4 cards, imagens, links demo/code, GitHub button |
| `PulseRunner` | ✅ | Estados idle/running/over, score, acessibilidade |
| `Scene3D` | ✅ | Container, canvas, classes, estrutura DOM |
| `SoftSkillsSection` | ✅ | 12 skills × 3 cópias, carrossel, hover/pause |
| `useGithubData` | ✅ | Fetch, total, filtragem por data, weeks, erros |

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Chaves de API: Mapbox, Groq, EmailJS

### Frontend

```bash
# Clone o repositório
git clone https://github.com/cledeocirmarafao/dev-portfolio.git
cd dev-portfolio

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Preencha o `.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_MAPBOX_TOKEN=seu_token_mapbox
```

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

### Backend (Chatbot)

```bash
cd server
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Preencha o `.env` do servidor:

```env
GROQ_API_KEY=sua_chave_groq
FRONTEND_URL=http://localhost:5173
PORT=3001
```

```bash
# Inicie o servidor
npm run dev
```

---

## 🚢 Deploy

| Serviço | Plataforma | Trigger |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Push para `main` → build automático |
| Backend | [Railway](https://railway.app) | Push para `main` → deploy automático |

### Variáveis de ambiente em produção

**Vercel (Frontend)**

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL do backend Railway |
| `VITE_MAPBOX_TOKEN` | Token público Mapbox |

**Railway (Backend)**

| Variável | Descrição |
|---|---|
| `GROQ_API_KEY` | Chave da API Groq |
| `FRONTEND_URL` | URL do frontend Vercel |
| `PORT` | Porta do servidor (Railway injeta automaticamente) |

---

## 🤖 Chatbot — Arquitetura

O assistente virtual é alimentado pelo modelo **Llama 3.3 70B Versatile** via Groq Cloud. O sistema prompt (`context.ts`) contém todo o contexto profissional de Cledeocir, com regras de formatação Markdown para respostas concisas e bem estruturadas. O frontend renderiza as respostas via `react-markdown` com componentes customizados.

```
Usuário → ChatBot.tsx → POST /api/chat
                              ↓
                        chat.ts (Hono)
                              ↓
                    Groq SDK → Llama 3.3 70B
                              ↓
                    context.ts (system prompt)
                              ↓
                    reply (Markdown) → ReactMarkdown
```

---

## 🎮 Pulse Runner

Mini-game integrado à seção de contato. O jogo roda em `<canvas>` com loop via `requestAnimationFrame`, gerenciado pelo hook `usePulseRunnerGame`. Ao enviar o formulário de contato com sucesso, o jogador recebe um **boost de 150 pontos**.

- **Controles:** Espaço ou clique para pular
- **Estados:** `idle` → `running` → `over`
- **Persistência:** High score salvo na sessão

---

## 🌍 Internacionalização

O portfólio suporta **Português (PT-BR)** e **Inglês (EN)** com alternância instantânea via `LanguageToggle`. Todas as seções, tooltips, labels e mensagens do chatbot estão traduzidos nos arquivos `src/locales/pt.json` e `src/locales/en.json`.

---

## ♿ Acessibilidade

- Semântica HTML correta (`section`, `main`, `nav`, `h1-h4`)
- `aria-label` em todos os elementos interativos
- `alt` descritivos em todas as imagens
- Navegação por teclado no mini-game (`tabIndex`)
- `aria-hidden` nas camadas decorativas de glitch
- Contraste adequado em todos os temas

---

## 📄 Licença

Este projeto é de uso pessoal. O código pode ser consultado como referência, mas não deve ser reproduzido como portfólio próprio.

---

<div align="center">

Feito com ❤️ e ☕ em Florianópolis, SC 🏝️

**[cledeocirmarafao.com.br](https://www.cledeocirmarafao.com.br)**

</div>