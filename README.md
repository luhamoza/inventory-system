## Inventory API with Go and SQLite

This is a Go web application that implements a simple inventory API using a SQLite database.

**Features:**

- List all products in the inventory.
- Filter products by category (optional).
- Get details of a specific product by ID.
- Add a new product to the inventory.
- Update an existing product.
- Delete a product from the inventory.
- Populate the database with a random set of products (for testing purposes).

**Technologies Used:**

- Go: Programming language for building the API.
- Gorilla Mux: Routing library for handling HTTP requests.
- SQLite: Embedded relational database for storing product data.
- faker: Go library for generating fake data (used for database population).

**Running the Application:**

1. Clone this repository.
2. Install dependencies: `go mod download`
3. Run the application: `go run main.go`
4. The server will start on port 3001.

**API Endpoints:**

| Endpoint                   | Method | Description                                                                 |
| -------------------------- | ------ | --------------------------------------------------------------------------- |
| /api/inventory             | GET    | List all products in the inventory.                                         |
| /api/inventory             | GET    | List products filtered by category (optional query parameter: category).    |
| /api/inventory/{id}        | GET    | Get details of a product by ID.                                             |
| /api/add-inventory         | POST   | Add a new product to the inventory (JSON payload).                          |
| /api/update-inventory/{id} | PUT    | Update an existing product (JSON payload).                                  |
| /api/delete-inventory/{id} | DELETE | Delete a product from the inventory.                                        |
| /api/populate              | GET    | Populate the database with a random set of products (query parameter: num). |
