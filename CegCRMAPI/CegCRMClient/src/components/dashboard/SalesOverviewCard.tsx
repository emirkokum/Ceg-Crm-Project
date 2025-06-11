import { useEffect, useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllSales } from "@/api/sale";
import { Sale } from "@/types/sale";
import { Progress } from "@/components/ui/progress";

export function SalesOverviewCard() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await getAllSales();
        if (response.data?.success) {
          setSales(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.finalAmount, 0);
  const lastMonthRevenue = sales
    .filter(sale => {
      const saleDate = new Date(sale.saleDate);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return saleDate >= lastMonth;
    })
    .reduce((sum, sale) => sum + sale.finalAmount, 0);

  const growthRate = lastMonthRevenue > 0 
    ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;

  const averageSale = totalRevenue / (sales.length || 1);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sales Overview</CardTitle>
          <CardDescription>Revenue and growth metrics</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Total Sales</span>
              </div>
              <div className="text-2xl font-bold">{sales.length}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Avg. Sale</span>
              </div>
              <div className="text-2xl font-bold">${averageSale.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Growth Rate</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {growthRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={Math.min(growthRate, 100)} className="h-2" />
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 