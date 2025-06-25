import { useState } from "react";
import { useCreateTicket, useUpdateTicketStatus, useAssignRandomEmployee, useTicketsByCustomer } from "@/features/hooks/useTicketApi";
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
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import MyTicketsTable from "../components/MyTicketsTable";
import { TicketStatus } from "@/constants/enums";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const createTicket = useCreateTicket();
  const updateStatus = useUpdateTicketStatus();
  const assignRandom = useAssignRandomEmployee();
  
  // Fetch user's tickets
  const { data: userTickets = [], isLoading: isLoadingTickets } = useTicketsByCustomer(userInfo?.id || "");
  
  const [formData, setFormData] = useState({
    description: "",
  });
  const [createdTicket, setCreatedTicket] = useState<{
    id: string;
    aiSuggestedSolution?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createTicket.mutateAsync({
        description: formData.description,
      });
      
      // Extract the ticket data from the response
      const ticketData = result.data?.data || result.data;
      setCreatedTicket({
        id: ticketData.id,
        aiSuggestedSolution: ticketData.aiSuggestedSolution,
      });
      
      toast.success("Ticket created successfully");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error creating ticket");
    }
  };

  const handleSolutionWorked = async () => {
    if (!createdTicket) return;
    
    try {
      await updateStatus.mutateAsync({
        ticketId: createdTicket.id,
        newStatus: 4 
      });
      toast.success("Ticket marked as resolved");
      navigate("/");
    } catch (error) {
      console.error("Error marking ticket as resolved:", error);
      toast.error("Error marking ticket as resolved");
    }
  };

  const handleDidntWork = async () => {
    if (!createdTicket) return;
    
    try {
      await updateStatus.mutateAsync({
        ticketId: createdTicket.id,
        newStatus: TicketStatus.AssignedToEmployee
      });
      toast.success("Ticket assigned to an employee");
      navigate("/");
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast.error("Error assigning ticket to employee");
    }
  };

  const isLoading = createTicket.isPending || updateStatus.isPending || assignRandom.isPending;

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
          {!createdTicket ? (
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
                  onClick={() => navigate("/tickets/create")}
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
          ) : (
            <div className="space-y-6">
              {/* AI Response Card */}
              {createdTicket.aiSuggestedSolution && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      AI Suggested Solution
                    </CardTitle>
                    <CardDescription className="text-green-700">
                      Here's what our AI system suggests to resolve your issue:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-green-800 whitespace-pre-wrap">
                        {createdTicket.aiSuggestedSolution}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Did this solution work for you?</CardTitle>
                  <CardDescription>
                    Let us know if the AI solution resolved your issue or if you need human assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleSolutionWorked}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {updateStatus.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Solution Worked
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleDidntWork}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1"
                    >
                      {assignRandom.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Didn't Work
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Back to Tickets Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/tickets/create/create")}
                  disabled={isLoading}
                >
                  Back to Tickets
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 