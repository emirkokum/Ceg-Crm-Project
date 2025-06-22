export enum SaleStatus {
  Pending = 0,
  Completed = 1,
  Cancelled = 2
}

export interface Sale {
  id: string;
  saleDate: string;
  customerId: string;
  salesPersonId: string;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  status: SaleStatus; //enum
  invoiceNumber: string | null;
  createdDate: string;
  updatedDate: string | null;
  saleProducts: SaleProduct[] | null;
}

export interface CreateSale {
  saleDate: string;
  customerId: string;
  salesPersonId: string;
  totalAmount: number;
  discount: number;
  tax: number;
  finalAmount: number;
  status: string | null;
  invoiceNumber: string | null;
  products: SaleProductItem[] | null;
}

export interface SaleProduct {
  productId: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface SaleProductItem {
  productId: string;
  quantity: number;
  unitPrice: number;
} 