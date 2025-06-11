import { useEffect, useState } from "react";
import { 
  MessageSquare, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllInteractions } from "@/api/interaction";
import { Interaction } from "@/types/interaction";
import { Progress } from "@/components/ui/progress";

export function InteractionsOverviewCard() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await getAllInteractions();
        if (response.data?.success) {
          setInteractions(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching interactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayInteractions = interactions.filter(interaction => {
    const interactionDate = new Date(interaction.interactionDate);
    interactionDate.setHours(0, 0, 0, 0);
    return interactionDate.getTime() === today.getTime();
  });

  const messageInteractions = todayInteractions.filter(i => i.type === "Message").length;
  const callInteractions = todayInteractions.filter(i => i.type === "Call").length;
  const emailInteractions = todayInteractions.filter(i => i.type === "Email").length;
  const totalInteractions = todayInteractions.length;

  const messagePercentage = totalInteractions > 0 ? (messageInteractions / totalInteractions) * 100 : 0;
  const callPercentage = totalInteractions > 0 ? (callInteractions / totalInteractions) * 100 : 0;
  const emailPercentage = totalInteractions > 0 ? (emailInteractions / totalInteractions) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Customer Interactions</CardTitle>
          <CardDescription>Today's interaction overview</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Messages</span>
              </div>
              <div className="text-2xl font-bold">{messageInteractions}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Calls</span>
              </div>
              <div className="text-2xl font-bold">{callInteractions}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-muted-foreground">Emails</span>
              </div>
              <div className="text-2xl font-bold">{emailInteractions}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Interaction Distribution</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Today
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Messages</span>
                <span>{messagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={messagePercentage} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Calls</span>
                <span>{callPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={callPercentage} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Emails</span>
                <span>{emailPercentage.toFixed(1)}%</span>
              </div>
              <Progress value={emailPercentage} className="h-2" />
            </div>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Interactions</p>
                <p className="text-2xl font-bold">{totalInteractions}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 