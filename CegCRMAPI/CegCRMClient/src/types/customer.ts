export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    industryType: number;
    type: number;
    createdAt: string;
    fullName?: string;
    updatedAt: string;
  }
  
export interface CreateCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  industryType: number;
}

export interface UpdateCustomer {
  id: string;
  data: Partial<CreateCustomer>;
}
  