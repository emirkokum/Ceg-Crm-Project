import { 
  MessageSquare, 
  Phone, 
  Mail,
  Calendar,
  TrendingUp,
  Users,
  Video
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Interaction } from "@/types/interaction";

interface CustomerInteractionsOverviewCardProps {
  interactions: Interaction[];
  customerName?: string;
  title?: string;
  description?: string;
  showDistribution?: boolean;
  filterByDate?: boolean;
  isLoading?: boolean;
}

export function CustomerInteractionsOverviewCard({ 
  interactions, 
  customerName = "",
  title = "Customer Interactions", 
  description = "Customer interaction overview",
  showDistribution = true,
  filterByDate = true,
  isLoading = false
}: CustomerInteractionsOverviewCardProps) {
  // Null check for interactions array
  const safeInteractions = interactions || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredInteractions = filterByDate 
    ? safeInteractions.filter((interaction: Interaction) => {
        const interactionDate = new Date(interaction.interactionDate);
        interactionDate.setHours(0, 0, 0, 0);
        return interactionDate.getTime() === today.getTime();
      })
    : safeInteractions;

  // Count interactions by type using string comparison
  const messageInteractions = filteredInteractions.filter((i: Interaction) => {
    const typeStr = String(i.type).toLowerCase();
    return typeStr === "message" || typeStr === "mesaj";
  }).length;
  
  const callInteractions = filteredInteractions.filter((i: Interaction) => {
    const typeStr = String(i.type).toLowerCase();
    return typeStr === "phone" || typeStr === "call" || typeStr === "telefon";
  }).length;
  
  const emailInteractions = filteredInteractions.filter((i: Interaction) => {
    const typeStr = String(i.type).toLowerCase();
    return typeStr === "email" || typeStr === "e-posta";
  }).length;
  
  const meetingInteractions = filteredInteractions.filter((i: Interaction) => {
    const typeStr = String(i.type).toLowerCase();
    return typeStr === "meeting" || typeStr === "toplantı";
  }).length;

  const totalInteractions = filteredInteractions.length;

  const messagePercentage = totalInteractions > 0 ? (messageInteractions / totalInteractions) * 100 : 0;
  const callPercentage = totalInteractions > 0 ? (callInteractions / totalInteractions) * 100 : 0;
  const emailPercentage = totalInteractions > 0 ? (emailInteractions / totalInteractions) * 100 : 0;
  const meetingPercentage = totalInteractions > 0 ? (meetingInteractions / totalInteractions) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-8 sm:h-10 bg-muted rounded" />
            <div className="h-8 sm:h-10 bg-muted rounded" />
            <div className="h-8 sm:h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1 min-w-0 flex-1">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
            {customerName ? `${customerName} - ${title}` : title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm truncate">{description}</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
          <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Messages</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{messageInteractions}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Calls</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{callInteractions}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Emails</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{emailInteractions}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Video className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Meetings</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{meetingInteractions}</div>
            </div>
          </div>

          {showDistribution && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">Interaction Distribution</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {filterByDate ? "Today" : "All Time"}
                </Badge>
              </div>
              <div className="space-y-2">
                {messageInteractions > 0 && (
                  <>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>Messages</span>
                      <span>{messagePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={messagePercentage} className="h-1.5 sm:h-2" />
                  </>
                )}
                
                {callInteractions > 0 && (
                  <>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>Calls</span>
                      <span>{callPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={callPercentage} className="h-1.5 sm:h-2" />
                  </>
                )}
                
                {emailInteractions > 0 && (
                  <>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>Emails</span>
                      <span>{emailPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={emailPercentage} className="h-1.5 sm:h-2" />
                  </>
                )}

                {meetingInteractions > 0 && (
                  <>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span>Meetings</span>
                      <span>{meetingPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={meetingPercentage} className="h-1.5 sm:h-2" />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg border p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">Total Interactions</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{totalInteractions}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 