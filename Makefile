####################################
# Common
####################################

up:
	docker-compose up -d

down:
	docker-compose down

start:
	make up

stop:
	make down

status:
	docker-compose ps

shell:
	make up
	docker-compose exec app bash

####################################
# Development
####################################

install:
	docker-compose exec app yarn install

build:
	docker-compose exec app yarn build

dev:
	docker-compose exec app yarn dev

test:
	make up
	make install
	docker-compose exec app yarn test
	make down

test-watch:
	docker-compose exec app yarn test:watch