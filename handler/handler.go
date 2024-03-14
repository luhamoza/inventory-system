package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jaswdr/faker/v2"
	"github.com/luhamoza/inventory-system/database"
	"github.com/luhamoza/inventory-system/models"
)

func ListProducts(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	query := "SELECT id, name, price, category, supplier FROM products"
	if category != "" {
		query += " WHERE category='" + category + "'"
	}

	rows, err := database.DB.Query(query)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to query database: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	products := make([]models.Product, 0)
	for rows.Next() {
		var product models.Product
		err := rows.Scan(&product.ID, &product.Name, &product.Price, &product.Category, &product.Supplier)
		if err != nil {
			http.Error(w, fmt.Sprintf("Failed to scan row: %v", err), http.StatusInternalServerError)
			return
		}
		products = append(products, product)
	}

	json.NewEncoder(w).Encode(products)
}

func GetProductByID(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	var product models.Product
	err = database.DB.QueryRow("SELECT id, name, price, category, supplier FROM products WHERE id = ?", id).Scan(&product.ID, &product.Name, &product.Price, &product.Category, &product.Supplier)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to retrieve product: %v", err), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(product)
}

func AddProduct(w http.ResponseWriter, r *http.Request) {
	var product models.Product
	err := json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec("INSERT INTO products(name, price, category, supplier) VALUES (?, ?, ?, ?)", product.Name, product.Price, product.Category, product.Supplier)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to insert product: %v", err), http.StatusInternalServerError)
		return
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get last insert ID: %v", err), http.StatusInternalServerError)
		return
	}

	product.ID = int(lastInsertID)
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

func UpdateProduct(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	var product models.Product
	err = json.NewDecoder(r.Body).Decode(&product)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	_, err = database.DB.Exec("UPDATE products SET name = ?, price = ?, category = ?, supplier = ? WHERE id = ?", product.Name, product.Price, product.Category, product.Supplier, id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to update product: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteProduct(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	_, err = database.DB.Exec("DELETE FROM products WHERE id = ?", id)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to delete product: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func PopulateDatabase(w http.ResponseWriter, r *http.Request) {
	queryValues := r.URL.Query()
	numProductsStr := queryValues.Get("num")
	numProducts, err := strconv.Atoi(numProductsStr)
	if err != nil {
		http.Error(w, "Invalid number of products", http.StatusBadRequest)
		return
	}
	fake := faker.New()
	for i := 1; i <= numProducts; i++ {
		product := models.Product{
			Name:     fake.Food().Vegetable(),
			Price:    fake.IntBetween(1, 100),
			Category: fake.Color().ColorName(),
			Supplier: fake.Car().Maker(),
		}
		_, err := database.DB.Exec("INSERT INTO products(name, price, category, supplier) VALUES (?, ?, ?, ?)", product.Name, product.Price, product.Category, product.Supplier)
		if err != nil {
			log.Printf("Failed to insert product %d: %v\n", i, err)
			http.Error(w, fmt.Sprintf("Failed to insert product %d: %v", i, err), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, "Successfully populated database with %d products", numProducts)
}
