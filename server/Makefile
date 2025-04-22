postgresinit:
	docker run --name nextchat-psql -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:12-alpine

postgres:
	docker exec -it nextchat-psql psql

createdb:
	docker exec -it nextchat-psql createdb --username=root --owner=root nextchat-db

dropdb:
	docker exec -it nextchat-psql dropdb next-chat-psql

createmigration:
	migrate create -ext sql -dir db/migrations add_users_table

migrateup:
	migrate -path db/migrations -database postgresql://root:password@localhost:5433/nextchat-db?sslmode=disable -verbose up

migratedown:
	migrate -path db/migrations -database postgresql://root:password@localhost:5433/nextchat-db?sslmode=disable -verbose down

.PHONY: postgresinit postgres createdb dropdb createmigration migrateup migratedown

