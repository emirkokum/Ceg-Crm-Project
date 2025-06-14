import { Note } from "./Note";

export interface Lead {
  id: string;
  assignedToEmployeeId:string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: number; //enum
  status: number; //enum
  industry: number; //enum
  notes: Note;
  createdDate: string;
  updatedDate: string;
} 