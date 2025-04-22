package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Database struct {
	db *sql.DB
}

func NewDatabse() (*Database, error) {
	db, err := sql.Open("postgres", "postgresql://root:password@localhost:5433/nextchat-db?sslmode=disable")
	if err != nil {
		return nil, err
	}
	return &Database{db: db}, nil
}

func (d *Database) GetDB() *sql.DB {
	return d.db
}
