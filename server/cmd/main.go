package main

import (
	"log"
	"server/db"
	"server/internal/user"
	"server/internal/ws"
	"server/router"
)

func main() {
	dbConn, err := db.NewDatabse()
	if err != nil {
		log.Fatalf("couldn't inititialize db connection %s", err)
	}
	userRep := user.NewRepository(dbConn.GetDB())
	userSvc := user.NewService(userRep)
	userHandler := user.NewHandler(userSvc)

	hub := ws.NewHub()
	wsHandler := ws.NewHandler(hub)

	// hub seeprate go routine
	go hub.Run()
	router.InitRouter(userHandler, wsHandler)
	router.Start("0.0.0.0:8080")
}
