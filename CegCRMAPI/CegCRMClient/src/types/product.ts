export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  saleProducts?: SaleProduct[];
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface UpdateProduct {
  id: string;
  data: Partial<CreateProduct>;
}

export interface SaleProduct {
  id: string;
  productId: string;
  saleId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
} 