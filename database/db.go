package database

import (
	"database/sql"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
    var err error
    DB, err = sql.Open("sqlite3", "api.db")

    if err != nil {
        panic("Could not initialize db")
    }
    DB.SetMaxOpenConns(25)
    DB.SetMaxIdleConns(25)
    DB.SetConnMaxLifetime(5 * time.Minute)

    createProductTable()
}

func createProductTable() {
    // Implement your createProductTable function here
	sqlStmt := `CREATE TABLE IF NOT EXISTS products (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		price INTEGER NOT NULL,
		category TEXT NOT NULL,
		supplier TEXT NOT NULL
	)`
	_, err := DB.Exec(sqlStmt)
	if err != nil {
		panic("Could not create products table")
	}
}
