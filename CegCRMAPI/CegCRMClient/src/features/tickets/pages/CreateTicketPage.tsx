import { useState } from "react";
import { useCreateTicket } from "@/features/hooks/useTicketApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();
  const [formData, setFormData] = useState({
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTicket.mutateAsync({
        ...formData,
        status: "Open",
        customerId: "", // Bu kısmı AuthContext'ten alacağız
        assignedEmployeeId: null,
      });
      toast.success("Ticket created successfully");
      navigate("/tickets");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Error creating ticket");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Ticket</CardTitle>
          <CardDescription>
            Fill in the details below to create a new support ticket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your issue in detail..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                required
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/tickets")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTicket.isPending}>
                {createTicket.isPending ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 