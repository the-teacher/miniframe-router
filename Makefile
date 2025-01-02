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
	make up
	make install
	docker-compose exec app yarn build
	make down

dev:
	docker-compose exec app yarn dev

test:
	make up
	make install
	docker-compose exec app yarn test
	make down

test-watch:
	docker-compose exec app yarn test:watch

####################################
# NPM
####################################

npm_login:
	npm login

npm_publish:
	npm publish

npm_bump_patch:
	make build
	npm version patch

npm_bump_minor:
	make up
	make install
	docker-compose exec app bash -c "git config --global user.email 'dev@izykin.com'"
	docker-compose exec app bash -c "git config --global user.name 'Ilya N. Zykin'"
	docker-compose exec app npm version minor
	make down

npm_bump_major:
	make up
	make install
	docker-compose exec app bash -c "git config --global user.email 'dev@izykin.com'"
	docker-compose exec app bash -c "git config --global user.name 'Ilya N. Zykin'"
	docker-compose exec app npm version major
	make down

npm_unpublish:
	npm unpublish miniframe-router@1.1.0
