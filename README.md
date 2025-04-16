# Pomohour 🕒

**Pomohour** é um timer Pomodoro full‑stack, com autenticação de usuário e gerenciamento de tarefas, desenvolvido em Next.js e estilizado com Tailwind CSS.

---

## 🚀 Funcionalidades principais

- **Autenticação de Usuário**  
  Tela de login/registro para cada usuário ter seu próprio histórico de tarefas e sessões.
- **Timer Pomodoro**  
  Sessões de 25 minutos por padrão, com botão de “Start” para iniciar a contagem regressiva.
- **Gerenciamento de Tarefas**  
  - Criar novas tarefas  
  - Listar tarefas pendentes  
  - Deletar todas as tarefas  
  - Limpar apenas as tarefas concluídas

---

## 🧱 Tecnologias

- **Next.js** – React + SSR / API Routes  
- **NextAuth.js** – Autenticação de usuário  
- **Prisma** – ORM para modelagem e acesso ao banco de dados  
- **MongoDB** – Persistência de dados  
- **Tailwind CSS** – Estilização rápida e responsiva  
- **Vercel** – Deploy automático

---

## 🔧 Instalação e uso

1. **Clone o repositório**  
  git clone https://github.com/VHAlvesS/pomohour.git
  cd pomohour
2. **Instale as dependencias** 
  npm install
  # ou
  yarn
  # ou
  pnpm install
3. **Configure variáveis de ambiente** 
  Crie um arquivo .env.local na raiz com pelo menos:
  DATABASE_URL=<sua_string_de_conexão_MongoDB_ou_postgres>
  NEXTAUTH_SECRET=<uma_string_secreta_para_cookies>
  NEXTAUTH_URL=http://localhost:3000
4. **Execute em modo de desenvolvimento**
  npm run dev
  # ou
  yarn dev
  # ou
  pnpm dev

