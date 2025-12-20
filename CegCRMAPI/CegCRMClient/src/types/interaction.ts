export interface Interaction {
  id: string;
  customerId: string;
  type: number; //enum
  content: string;
  interactionDate: string;
  customerFullName: string;
}

export interface CreateInteraction {
  customerId: string;
  type: string;
  content: string;
  interactionDate: string;
} 