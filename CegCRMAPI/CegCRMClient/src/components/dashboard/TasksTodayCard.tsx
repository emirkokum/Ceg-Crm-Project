import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ListTodo,
  TrendingUp
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
import { useTasks } from "@/features/hooks/useTaskApi";
import { useEnum } from "@/features/hooks/useEnums";
import { Task } from "@/types/task";
import { useAuth } from "@/hooks/useAuth";

export function TasksTodayCard() {
  const { data: tasks = [], isLoading } = useTasks();
  const { data: taskStatusOptions } = useEnum("task-status");
  const { user } = useAuth();

  // Find the numeric value for "Completed" status
  const completedStatusId = taskStatusOptions?.find(status => status.label.toLowerCase() === "completed")?.value;

  // Null check for tasks array
  const safeTasks = tasks || [];

  // Filter tasks based on user role
  let visibleTasks: Task[] = safeTasks;
  if (user && user.role !== "Admin" && user.role !== "Manager") {
    visibleTasks = safeTasks.filter((task: Task) => task.assignedEmployeeId === user.id);
  }

  // Tüm taskları göster (tarih filtrelemesi kaldırıldı)
  const todayTasks = visibleTasks;

  const completedTasks = todayTasks.filter((task: Task) => task.status === completedStatusId).length;
  const pendingTasks = todayTasks.length - completedTasks;
  const completionRate = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Today's Tasks</CardTitle>
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
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Today's Tasks</CardTitle>
          <CardDescription className="text-xs sm:text-sm truncate">Task completion overview</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
          <ListTodo className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Completed</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{completedTasks}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Pending</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{pendingTasks}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Completion Rate</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {completionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={completionRate} className="h-1.5 sm:h-2" />
          </div>

          <div className="rounded-lg border p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">Total Tasks</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{todayTasks.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
                <ListTodo className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 