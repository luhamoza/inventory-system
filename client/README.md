# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

**Inventory System**

This React component provides a user interface for managing an inventory system. It allows users to:

- View a list of products with details like name, price, category, and supplier
- Sort the product list by different columns (name, price, category, supplier)
- Add new products
- Edit existing products
- Delete products

**Installation**

**Dependencies:**

- React
- axios
- You'll also need the UI component files from `./components/ui` (implementation not shown here)

**Usage:**

1. Clone the repo and install the required dependencies:
   ```bash
   npm install
   ```

**API Endpoints (simulated using local server):**

- `GET http://localhost:3001/api/inventory`: Retrieves a list of products
- `POST http://localhost:3001/api/add-inventory`: Adds a new product
- `PUT http://localhost:3001/api/update-inventory/:id`: Updates an existing product
- `DELETE http://localhost:3001/api/delete-inventory/:id`: Deletes a product (replace `:id` with the actual product ID)
