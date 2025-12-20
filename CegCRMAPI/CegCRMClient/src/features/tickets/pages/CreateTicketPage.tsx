import { useState } from "react";
import { useCreateTicket, useTicketsByCustomer } from "@/features/hooks/useTicketApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import MyTicketsTable from "../components/MyTicketsTable";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const createTicket = useCreateTicket();
  
  // Fetch user's tickets
  const { data: userTickets = [], isLoading: isLoadingTickets } = useTicketsByCustomer(userInfo?.id || "");
  
  const [formData, setFormData] = useState({
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createTicket.mutateAsync({
        description: formData.description,
      });
      
      // Extract the ticket data from the response
      const ticketData = result.data?.data || result.data;
      
      toast.success("Ticket created successfully");
      
      // Redirect to ticket detail page
      navigate(`/tickets/${ticketData.id}`);
    } catch (error) {
      toast.error("Error creating ticket");
    }
  };

  const isLoading = createTicket.isPending;

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>My Previous Tickets</CardTitle>
          <CardDescription>
            View and manage your previously created support tickets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MyTicketsTable 
            tickets={userTickets} 
            isLoading={isLoadingTickets} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Support Ticket</CardTitle>
          <CardDescription>
            Describe your issue in detail and we'll provide an AI-powered solution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Issue Description
              </Label>
              <Textarea
                id="description"
                placeholder="Please describe your issue in detail. Be as specific as possible to help us provide the best solution..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
                className="min-h-[200px] resize-none"
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Provide as much detail as possible about your issue, including any error messages, steps to reproduce, and what you've already tried.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !formData.description.trim()}
                className="min-w-[120px]"
              >
                {createTicket.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Ticket"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 