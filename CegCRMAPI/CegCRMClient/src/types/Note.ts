export interface Note{
    id:string;
    content:string;
    customerId:string | null;
    leadId:string | null;
    ticketId:string | null;
    saleId:string | null;
    taskId:string | null;
}