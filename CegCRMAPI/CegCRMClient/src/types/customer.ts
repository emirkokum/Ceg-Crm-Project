export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    type: "Person" | "Business";
    createdAt: string;
    fullName?: string;
  }
  