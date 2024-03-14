package api

import (
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/luhamoza/inventory-system/database"
	"github.com/luhamoza/inventory-system/handler"
)

func InitServer() {

	router := mux.NewRouter()
	database.InitDB()

	router.HandleFunc("/api/inventory", handler.ListProducts).Methods("GET")
	router.HandleFunc("/api/inventory/{id}", handler.GetProductByID).Methods("GET")
	router.HandleFunc("/api/add-inventory", handler.AddProduct).Methods("POST")
	router.HandleFunc("/api/delete-inventory/{id}", handler.DeleteProduct).Methods("DELETE")
	router.HandleFunc("/api/update-inventory/{id}", handler.UpdateProduct).Methods("PUT")
	router.HandleFunc("/api/populate", handler.PopulateDatabase).Methods("GET")

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS", "DELETE"})

    log.Println("Server is running on port 3001...")
	log.Fatal(http.ListenAndServe(":3001", handlers.CORS(headersOk, originsOk, methodsOk)(router)))

}
