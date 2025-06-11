import { TicketsCard } from "@/components/dashboard/TicketsCard";
import { SalesOverviewCard } from "@/components/dashboard/SalesOverviewCard";
import { LeadsSummary } from "@/components/dashboard/LeadsSummary";
import { TasksTodayCard } from "@/components/dashboard/TasksTodayCard";
import { useAuth } from "@/hooks/useAuth";
import { InteractionsOverviewCard } from "@/components/dashboard/InteractionsOverviewCard";

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("role") || "BaseUser";

  return (
    <div className="space-y-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4">
        {["Admin", "Support"].includes(role) && (
          <div className="md:col-span-2 lg:col-span-1 2xl:col-span-1">
            <TicketsCard />
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
          <InteractionsOverviewCard />
        </div>
      </div>
    </div>
  );
}
