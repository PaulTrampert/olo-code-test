# olo-code-test

## Run in "production"
`docker compose up`

## Run in dev mode with file watching
`docker compose -f docker-compose.yml -f docker-compose.dev.yml up`

## Run tests
`docker compose -f docker-compose.yml -f docker-compose.test.yml up --exit-code-from api`