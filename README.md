# 📹 Sell Videos - Marketplace para Videomakers (Frontend)

O **Sell Videos** é uma plataforma de marketplace focada em criadores de conteúdo e videomakers. O sistema permite que profissionais disponibilizem e vendam galerias de vídeos de eventos (como campeonatos esportivos, casamentos, etc.) diretamente para a comunidade.

O criador tem total liberdade para organizar e expor suas galerias, enquanto a plataforma cuida do processamento de pagamentos e da liberação dos arquivos de vídeo comprados individualmente ou em lotes pelos usuários finais.

Este repositório contém a aplicação **Frontend** do projeto.


## 🛠️ Tecnologias e Ferramentas

Este projeto utiliza um ecossistema moderno focado em performance, tipagem segura e escalabilidade:

* **[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/):** Base da interface da aplicação.
* **[Vite](https://vitejs.dev/):** Ferramenta de build e servidor de desenvolvimento.
* **[Zustand](https://github.com/pmndrs/zustand):** Gerenciamento de estado global.
* **[GraphQL](https://graphql.org/):** Linguagem de consulta para APIs utilizada para busca de dados complexos.
* **[Apollo Client](https://www.apollographql.com/):** Cliente robusto para gerenciamento de dados e cache com GraphQL.
* **[Vitest](https://vitest.dev/) & [Testing Library](https://testing-library.com/):** Suíte de testes unitários e de componentes.
* **[Tailwind CSS](https://tailwindcss.com/):** Framework de estilização via classes utilitárias.

### Comunicação com a API

A aplicação utiliza uma arquitetura híbrida de comunicação, organizada em:

* `src/api/graphql/`: Integrações via **Apollo Client**. Utilizamos o [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) para gerar hooks e tipagens automáticas a partir do schema.
* `src/api/rest/`: Chamadas HTTP padrão para endpoints RESTful.


## 📜 Scripts Disponíveis

No diretório do projeto, você pode executar os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Vite. |
| `npm run build` | Compila o código TypeScript e gera o build de produção. |
| `npm run generate` | Executa o `graphql-codegen` para atualizar as tipagens e hooks do GraphQL. |
| `npm run test` | Executa os testes unitários via Vitest. |
| `npm run test:ui` | Abre a interface visual do Vitest para acompanhar os testes. |
| `npm run coverage` | Gera o relatório de cobertura de testes da aplicação. |
| `npm run lint` | Executa a verificação de erros e estilo de código com ESLint. |
| `npm run preview` | Visualiza localmente o build gerado para produção. |

---

## ⚙️ Como executar o projeto localmente

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18+)
* Gerenciador de pacotes (`npm`, `yarn` ou `pnpm`)

### Instalação

1. Clone o repositório:
   ```bash
   git clone [https://github.com/seu-usuario/sell-videos-front.git](https://github.com/seu-usuario/sell-videos-front.git)

2. Instale as dependências:
   ```bash
   npm install

3. Configure o ambiente:</br>
Crie um arquivo .env baseado no .env.example com as URLs da API.

4. Gere as tipagens do GraphQL:
   ```bash
   npm run generate

5. Inicie o projeto:
   ```bash
   npm run dev
  A aplicação estará disponível em http://localhost:5173.