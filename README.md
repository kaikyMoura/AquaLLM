# Aqua_Gas_Image_Processor - Api de extração de dados de umagens #

## Introdução

API de processamento eficiente de imagens de contas de água ou gás, utilizando a tecnologia de Modelos de Linguagem de Grande Escala (LLM) da Google. Com ela, é possível extrair informações essenciais, como valores de consumo e detalhes de cobrança, a partir de imagens enviadas pelos usuários, facilitando a gestão e análise de dados de consumo.

## Instalação e Execução do Projeto

Pré-requisitos

Certifique-se de ter o Node.js instalado em sua máquina. Além do banco de dados postgres, que pode ser baixado através do [site oficial](https://www.postgresql.org/download/).

``` bash

# Checa a versão do node
node -v

```

Se não estiver instalado, podemos usar a linha de comando para instalar ou acessar a propria página de download do [Node.js](https://nodejs.org/en/download/prebuilt-installer)


``` bash

npm install -g npm

```


Clonar o Repositório

Primeiro, clone o repositório para sua máquina local. Abra seu terminal e execute o comando abaixo:

```bash
git clone https://github.com/kaikyMoura/aqua_gas_image_processor.git
```

Depois, navegue até o diretório do projeto.


## Instalar Dependências

Instale todas as dependências necessárias para o projeto. Dependendo do gerenciador de pacotes que você prefere, execute um dos comandos abaixo:

```bash

npm install
#ou
yarn install
# ou
pnpm install
# ou
bun install

```


## Criar banco

O banco de dados utilizado foi o Postgres. 

Esse projeto usa o [prisma](https://www.prisma.io/) como ORM.

Para executar a migração é só utilizar um dos comandos abaixo dependendo do gerenciador de dependências utilizado:

```bash

npx prisma migrate dev

pnpm prisma migrate dev

yarn prisma migrate dev

```

Além disso é preciso criar manualmente o banco no postgres e criar um arquivo .env na pasta raiz do projeto.

No arquivo de contar a seguinte key:

```bash

DATABASE_URL="postgresql//<username>:<password>@localhost:5432/<dbname>

```


## Executar o Projeto

Com as dependências instaladas, você pode iniciar o servidor de desenvolvimento com:

```bash

npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev

```


A aplicação está rodando no seguinte endereço [http://localhost:5000](http://localhost:5000).



## Documentação

Este projeto utiliza [Express](https://expressjs.com/), um framework minimalista que facilita a o desenvolvimento de web frameworks com node.js .

Além do [TypeScript](https://www.typescriptlang.org/) como linguagem de desenvolvimento.


# Ferramentas e bibliotecas

- [prisma](https://www.prisma.io/) :
Ferramenta de mapeamento objeto-relacional (ORM) para Node.js e TypeScript que simplifica o trabalho com bancos de dados

- [eslint](https://eslint.org/):
 Ferramenta de linting para JavaScript e outros ambientes que permite identificar e corrigir problemas no código.

- [morgan](https://react-svgr.com/):
 Middleware de logging para aplicações Node.js.

- [google-storage](https://cloud.google.com/storage)
O Cloud Storage é um serviço gerenciado para armazenar dados não estruturados.
