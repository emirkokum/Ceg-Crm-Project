import { useState } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/features/hooks/useProductApi";
import { Product, CreateProduct, UpdateProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";

export function ProductsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [newProduct, setNewProduct] = useState<CreateProduct>({
    name: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    isActive: true,
  });

  const [editedProduct, setEditedProduct] = useState<UpdateProduct>({
    id: "",
    data: {
      name: "",
      description: "",
      price: 0,
      stockQuantity: 0,
      isActive: true,
    },
  });

  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return name.includes(searchLower) || description.includes(searchLower);
  });

  const handleCreateProduct = async () => {
    try {
      await createProduct.mutateAsync(newProduct);
      setIsCreateModalOpen(false);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stockQuantity: 0,
        isActive: true,
      });
      toast.success("Product created successfully");
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!productToEdit) return;
    try {
      await updateProduct.mutateAsync(editedProduct);
      setIsEditModalOpen(false);
      setProductToEdit(null);
      toast.success("Product updated successfully");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const openEditModal = (product: Product) => {
    setProductToEdit(product);
    setEditedProduct({
      id: product.id,
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
      },
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <Skeleton className="w-full md:w-1/2 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Table */}
      <Card>
        <CardContent className="px-10 py-5">
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                      {product.description}
                    </td>
                    <td className="p-4">${product.price.toFixed(2)}</td>
                    <td className="p-4">{product.stockQuantity}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => openEditModal(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => openDeleteDialog(product)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Product Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input 
                  id="stockQuantity" 
                  type="number"
                  min="0"
                  value={newProduct.stockQuantity}
                  onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isActive" 
                  checked={newProduct.isActive}
                  onCheckedChange={(checked) => setNewProduct({ ...newProduct, isActive: checked as boolean })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateProduct}
                disabled={createProduct.isPending || !newProduct.name.trim()}
              >
                {createProduct.isPending ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {productToEdit && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editName">Name</Label>
                  <Input 
                    id="editName" 
                    value={editedProduct.data.name}
                    onChange={(e) => setEditedProduct({ 
                      ...editedProduct, 
                      data: { ...editedProduct.data, name: e.target.value }
                    })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea 
                    id="editDescription" 
                    value={editedProduct.data.description}
                    onChange={(e) => setEditedProduct({ 
                      ...editedProduct, 
                      data: { ...editedProduct.data, description: e.target.value }
                    })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPrice">Price</Label>
                  <Input 
                    id="editPrice" 
                    type="number"
                    step="0.01"
                    min="0"
                    value={editedProduct.data.price}
                    onChange={(e) => setEditedProduct({ 
                      ...editedProduct, 
                      data: { ...editedProduct.data, price: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editStockQuantity">Stock Quantity</Label>
                  <Input 
                    id="editStockQuantity" 
                    type="number"
                    min="0"
                    value={editedProduct.data.stockQuantity}
                    onChange={(e) => setEditedProduct({ 
                      ...editedProduct, 
                      data: { ...editedProduct.data, stockQuantity: parseInt(e.target.value) || 0 }
                    })}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="editIsActive" 
                    checked={editedProduct.data.isActive}
                    onCheckedChange={(checked) => setEditedProduct({ 
                      ...editedProduct, 
                      data: { ...editedProduct.data, isActive: checked as boolean }
                    })}
                  />
                  <Label htmlFor="editIsActive">Active</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateProduct}
                  disabled={updateProduct.isPending || !editedProduct.data.name?.trim()}
                >
                  {updateProduct.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 