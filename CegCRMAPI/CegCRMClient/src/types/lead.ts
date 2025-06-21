export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: number; //enum
  status: number; //enum
  industry: number; //enum
  notes: string;
  createdDate: string;
  updatedDate: string;
} 