import { SectionCards } from "@/components/SectionCards";
import { ChartAreaInteractive } from "@/components/ChatArea";

export default function Dashboard() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
