default := 'squid'
types := 'typegen'
chain := 'people'

process CHAIN=chain: build
	CHAIN={{CHAIN}} node --require=dotenv/config lib/main.js

serve:
	@npx squid-graphql-server

up *FLAGS:
  docker compose up {{FLAGS}}

upd:
	@just up -d

pull:
  docker compose pull

clear:
  docker compose rm -f
  rm -rf .data

down:
  docker compose down

build:
	pnpm run build

codegen:
	npx squid-typeorm-codegen

typegen TAG=types:
	npx squid-substrate-typegen {{TAG}}.json

bug: down upd

reset: migrate

slow: 
	sleep 1
	just reset

quickstart: migrate process

quick: wipe bug slow process

wipe:
  clear

prod TAG:
	gh pr create --base release-{{TAG}}

migrate:
	npx squid-typeorm-migration apply

update-db:
	npx squid-typeorm-migration generate

revert-db:
	npx squid-typeorm-migration revert         

db: update-db migrate

test:
  pnpm run test:unit

improve TAG=default:
	npx sqd deploy -m {{TAG}}.yaml .

release TAG=default:
	npx sqd deploy -m {{TAG}}.yaml .

kill TAG:
	npx sqd squid:kill "stick@{{TAG}}"

tail TAG:
	npx sqd squid logs stick@{{TAG}} -f

brutal TAG=default:
	npx sqd deploy -r -m {{TAG}}.yaml .

update-deps:
	npx npm-check-updates -ux

exec:
	docker exec -it subsquid_db psql -U postgres -d squid

dump NAME=default:
	docker exec -t subsquid_db pg_dump -U postgres -d squid > {{NAME}}.sql

check: codegen build

kek: bug quick

fmt:
	deno fmt --no-semicolons --single-quote src/mappings src/*.ts