## Instruções para utilização ##


## Clonar repositório localmente
```bash
git clone https://github.com/kaikyMoura/projeto-next-react.git
```


## Gerar container contendo a aplicação.

```bash
docker componentes build and docker componentes up
#ou
docker compose up --build
```


## A respeito do .env

O banco de dados utilizado foi o postgres com o prisma.

Esses valores serão utilizados para configurar o banco de dados

Por via das dúvidas, preferi subir uma imagem postgres

```bash
GEMINI_API_KEY=chave da api da llm

POSTGRES_USER=usuario

POSTGRES_PASSWORD=senha

POSTGRES_DB=nome_do_banco

DATABASE_URL="postgresql://<usuario_do_banco>:<senha_do_banco>@postgres:5432/$<banco>?schema=public"
```
