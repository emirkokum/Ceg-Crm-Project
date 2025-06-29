import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "@/types/ticket";
import { Employee } from "@/types/employee";
import API from "@/api/axios";

interface MyTicketsTableProps {
  tickets: Ticket[];
  isLoading: boolean;
}

export default function MyTicketsTable({ tickets, isLoading }: MyTicketsTableProps) {
  const navigate = useNavigate();

  // Tüm employee'leri çek
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await API.get("/Employees");
      return response.data.data as Employee[];
    },
  });

  // Employee'leri ID'ye göre map'le
  const employeeMap = new Map(employees.map(emp => [emp.id, emp]));

  const getStatusColor = (status: number | string) => {
    const statusStr = typeof status === 'string' ? status : String(status);
    
    switch (statusStr) {
      case 'Open':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case 'ResolvedByAI':
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case 'AssignedToEmployee':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case 'Closed':
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: number | string) => {
    const statusStr = typeof status === 'string' ? status : String(status);
    
    switch (statusStr) {
      case 'Open':
        return "Open";
      case 'ResolvedByAI':
        return "Resolved by AI";
      case 'AssignedToEmployee':
        return "Assigned to Employee";
      case 'Closed':
        return "Closed";
      default:
        return statusStr || "Unknown";
    }
  };

  const handleRowClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tickets yet.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create your first support ticket above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Employee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => {
            const employee = ticket.assignedEmployeeId ? employeeMap.get(ticket.assignedEmployeeId) : null;
            
            return (
              <TableRow
                key={ticket.id}
                className="cursor-pointer transition-colors hover:bg-muted/50 hover:border-l-2 hover:border-l-primary"
                onClick={() => handleRowClick(ticket.id)}
              >
                <TableCell className="max-w-xs">
                  <div className="truncate">
                    {ticket.description.length > 100
                      ? `${ticket.description.substring(0, 100)}...`
                      : ticket.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {ticket.assignedEmployeeId ? (
                    isLoadingEmployees ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : employee ? (
                      <div className="text-sm font-medium">
                        {employee.user.firstName} {employee.user.lastName}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Employee not found</span>
                    )
                  ) : (
                    <span className="text-green-600 text-sm font-medium">Resolved by AI</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
} 