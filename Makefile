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