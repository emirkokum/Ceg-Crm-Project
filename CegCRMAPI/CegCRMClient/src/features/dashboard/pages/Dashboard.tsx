import { TicketsCard } from "@/components/dashboard/TicketsCard";
import { SalesOverviewCard } from "@/components/dashboard/SalesOverviewCard";
import { LeadsSummary } from "@/components/dashboard/LeadsSummary";
import { TasksTodayCard } from "@/components/dashboard/TasksTodayCard";
import { useAuth } from "@/hooks/useAuth";
import { InteractionsOverviewCard } from "@/components/dashboard/InteractionsOverviewCard";
import { useTickets } from "@/features/hooks/useTicketApi";
import { useInteractions } from "@/features/hooks/useInteractionApi";
import MyTicketsTable from "@/features/tickets/components/MyTicketsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTicketsByCustomer } from "@/features/hooks/useTicketApi";

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("role") || "BaseUser";
  const { data: tickets = [] } = useTickets();
  const { data: interactions = [], isLoading: isLoadingInteractions } = useInteractions();

  const { data: userTickets = [], isLoading: isLoadingTickets } = useTicketsByCustomer(user?.id || "");

  if (role === "Customer") {
    return (
      <div className="space-y-4 p-2 sm:p-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">My Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <MyTicketsTable tickets={userTickets} isLoading={isLoadingTickets} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-4">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
        {["Admin", "Support"].includes(role) && (
          <div className="col-span-1">
            <TicketsCard 
              tickets={tickets}
              title="Tickets Overview"
              description="Ticket management general view"
            />
          </div>
        )}

        {["Admin", "SalesPerson", "Manager"].includes(role) && (
          <>
            <div className="col-span-1">
              <SalesOverviewCard />
            </div>
            <div className="col-span-1">
              <LeadsSummary />
            </div>
          </>
        )}

        {["Assistant", "Admin"].includes(role) && (
          <div className="col-span-1">
            <TasksTodayCard />
          </div>
        )}

        <div className="col-span-1 lg:col-span-2">
          <InteractionsOverviewCard 
            interactions={interactions}
            title="Interactions With Customers"
            description="General view to Interactions"
            showDistribution={true}
            filterByDate={false}
            isLoading={isLoadingInteractions}
          />
        </div>
      </div>
    </div>
  );
}
