import { useParams, useNavigate } from "react-router-dom";
import { useCustomerById } from "@/features/hooks/userCustomerApi";
import { useInteractionsByCustomer } from "@/features/hooks/useInteractionApi";
import { useTicketsByCustomer } from "@/features/hooks/useTicketApi";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { TicketsCardsForCustomer } from "@/components/dashboard/TicketsCardsForCustomer";
import { CustomerInteractionsOverviewCard } from "@/components/dashboard/CustomerInteractionsOverviewCard";

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading } = useCustomerById(id || "");
  const { data: tickets = [], isLoading: isLoadingTickets } = useTicketsByCustomer(id || "");
  const { data: interactions = [], isLoading: isLoadingInteractions } = useInteractionsByCustomer(id || "");

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy", { locale: enUS });
    } catch {
      return "Date information not available";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (!customer) {
    toast.error("Error loading customer information");
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
                  <p className="text-red-500">Failed to load customer information</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
                          <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                {customer.email}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                {customer.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{customer.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Registration Date: {formatDate(customer.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
                          <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Customer Type:</span>{" "}
                                  {customer.type === "Person" ? "Individual" : "Corporate"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TicketsCardsForCustomer 
          tickets={tickets}
          customerName={customer.fullName}
          title="Tickets"
          description="Ticket History Of Customer"
          showResolutionRate={true}
          isLoading={isLoadingTickets}
        />
        
        <CustomerInteractionsOverviewCard 
          interactions={interactions}
          customerName={customer.fullName}
          title="Interactions"
          description="Interactions With Customer"
          showDistribution={true}
          filterByDate={false}
          isLoading={isLoadingInteractions}
        />
      </div>
    </div>
  );
} 