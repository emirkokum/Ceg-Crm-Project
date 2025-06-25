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
  const { data: interactions = [] } = useInteractions();

  const { data: userTickets = [], isLoading: isLoadingTickets } = useTicketsByCustomer(user?.id || "");

  if (role === "Customer") {
    return (
      <div className="space-y-4 p-4">
        <Card>
          <CardHeader>
            <CardTitle>My Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <MyTicketsTable tickets={userTickets} isLoading={isLoadingTickets} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4">
        {["Admin", "Support"].includes(role) && (
          <div className="md:col-span-2 lg:col-span-1 2xl:col-span-1">
            <TicketsCard 
              tickets={tickets}
              title="Tickets Overview"
              description="Ticket management general view"
            />
          </div>
        )}

        {["Admin", "SalesPerson", "Manager"].includes(role) && (
          <>
            <div className="md:col-span-2 lg:col-span-1 2xl:col-span-1">
              <SalesOverviewCard />
            </div>
            <div className="md:col-span-2 lg:col-span-1 2xl:col-span-1">
              <LeadsSummary />
            </div>
          </>
        )}

        {["Assistant", "Admin"].includes(role) && (
          <div className="md:col-span-2 lg:col-span-1 2xl:col-span-1">
            <TasksTodayCard />
          </div>
        )}

        <div className="md:col-span-2 lg:col-span-2 2xl:col-span-4">
          <InteractionsOverviewCard 
            interactions={interactions}
            title="Müşteri Etkileşimleri"
            description="Günlük etkileşim genel bakış"
            showDistribution={true}
            filterByDate={true}
          />
        </div>
      </div>
    </div>
  );
}
