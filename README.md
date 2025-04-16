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
   No terminal, digite o seguinte comando para clonar o repositório:
   - `git clone https://github.com/VHAlvesS/pomohour.git`
   - `cd pomohour`

2. **Instale as dependências**  
   Escolha uma das opções para instalar as dependências do projeto:
   - Com **npm**: Execute o comando `npm install`
   - Com **pnpm**: Execute o comando `pnpm install`

3. **Configure as variáveis de ambiente**  
   Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as seguintes variáveis:
   - `DATABASE_URL=<sua_string_de_conexão_MongoDB_ou_postgres>`
   - `NEXTAUTH_SECRET=<uma_string_secreta_para_cookies>`
   - `NEXTAUTH_URL=http://localhost:3000`

4. **Execute o projeto em modo de desenvolvimento**  
   Após a instalação das dependências, você pode iniciar o projeto com um dos seguintes comandos:
   - Com **npm**: Execute o comando `npm run dev`
   - Com **yarn**: Execute o comando `yarn dev`
   - Com **pnpm**: Execute o comando `pnpm dev`

