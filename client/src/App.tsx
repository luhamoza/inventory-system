import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  supplier: string;
}

const BASE_URL = "http://localhost:3001/api";

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState<
    "name" | "category" | "price" | "supplier"
  >("name");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${BASE_URL}/inventory`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addProduct = async () => {
    try {
      await axios.post(`${BASE_URL}/add-inventory`, {
        name,
        price: parseInt(price),
        category,
        supplier,
      });
      fetchProducts();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddProductClick = () => {
    setShowAddForm(!showAddForm);
  };

  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`${BASE_URL}/delete-inventory/${id}`);
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) return;
    try {
      await axios.put(`${BASE_URL}/update-inventory/${selectedProduct.id}`, {
        name: selectedProduct.name,
        price: selectedProduct.price,
        category: selectedProduct.category,
        supplier: selectedProduct.supplier,
      });
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "category") {
      return sortAsc
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortBy === "price") {
      return sortAsc ? a.price - b.price : b.price - a.price;
    } else if (sortBy === "supplier") {
      return sortAsc
        ? a.supplier.localeCompare(b.supplier)
        : b.supplier.localeCompare(a.supplier);
    } else {
      return sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
  });

  const toggleSort = (column: "name" | "category" | "price" | "supplier") => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <h2 className="text-6xl font-extrabold mb-4">Inventory System</h2>
      {/* Add Product Button */}
      <Button className="mt-4" onClick={handleAddProductClick}>
        {showAddForm ? "Cancel Add Product" : "Add Product"}
      </Button>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="mt-4 mb-4">
          <h2 className="text-xl font-extrabold mt-4 mb-4">Add Product</h2>
          <div className="grid gap-4 ">
            <div className="flex items-center gap-4">
              <Input
                required
                className=""
                placeholder="Enter product name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
              />
            </div>
            <div className="flex items-center gap-4">
              <Input
                required
                className="col-span-3"
                placeholder="Enter product price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                id="price"
              />
            </div>
            <div className="flex items-center gap-4">
              <Input
                required
                className="col-span-3"
                placeholder="Enter product category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="category"
              />
            </div>
            <div className="flex items-center gap-4">
              <Input
                required
                className="col-span-3"
                placeholder="Enter product supplier"
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                id="supplier"
              />
            </div>
          </div>
          <Button variant={"secondary"} className="mt-4" onClick={addProduct}>
            Add Product
          </Button>
        </div>
      )}

      {/* Modal to display product details */}
      {selectedProduct && (
        <div>
          <div className="grid gap-4 mt-4">
            <h2 className="text-xl font-extrabold">Update Product Details</h2>
            <div>
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                required
                placeholder="Enter product name"
                type="text"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                required
                placeholder="Enter product price"
                type="number"
                value={selectedProduct.price}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                required
                placeholder="Enter product category"
                type="text"
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    category: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="supplier" className="text-right">
                Supplier
              </Label>
              <Input
                required
                placeholder="Enter product supplier"
                type="text"
                value={selectedProduct.supplier}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    supplier: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-4 mb-4">
            <Button
              variant={"secondary"}
              className="mx-2"
              onClick={updateProduct}
            >
              Update
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => deleteProduct(selectedProduct.id)}
            >
              Delete
            </Button>
            <Button
              variant={"link"}
              className="mx-2"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>
              <Button variant={"link"} onClick={() => toggleSort("name")}>
                Name {sortBy === "name" ? (sortAsc ? "▲" : "▼") : ""}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant={"link"} onClick={() => toggleSort("price")}>
                Price {sortBy === "price" ? (sortAsc ? "▲" : "▼") : ""}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant={"link"} onClick={() => toggleSort("category")}>
                Category {sortBy === "category" ? (sortAsc ? "▲" : "▼") : ""}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant={"link"} onClick={() => toggleSort("supplier")}>
                Supplier {sortBy === "supplier" ? (sortAsc ? "▲" : "▼") : ""}
              </Button>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell onClick={() => handleProductClick(product)}>
                {product.name}
              </TableCell>
              <TableCell onClick={() => handleProductClick(product)}>
                {product.price}
              </TableCell>
              <TableCell onClick={() => handleProductClick(product)}>
                {product.category}
              </TableCell>
              <TableCell onClick={() => handleProductClick(product)}>
                {product.supplier}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleProductClick(product)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Inventory;
