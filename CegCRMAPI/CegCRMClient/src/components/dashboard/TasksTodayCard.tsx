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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the numeric value for "Completed" status
  const completedStatusId = taskStatusOptions?.find(status => status.label.toLowerCase() === "completed")?.value;

  // Filter tasks based on user role
  let visibleTasks: Task[] = tasks;
  if (user && user.role !== "Admin" && user.role !== "Manager") {
    visibleTasks = tasks.filter((task: Task) => task.assignedEmployeeId === user.id);
  }

  const todayTasks = visibleTasks.filter((task: Task) => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  const completedTasks = todayTasks.filter((task: Task) => task.status === completedStatusId).length;
  const pendingTasks = todayTasks.length - completedTasks;
  const completionRate = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Today's Tasks</CardTitle>
          <CardDescription>Task completion overview</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <ListTodo className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Completed</span>
              </div>
              <div className="text-2xl font-bold">{completedTasks}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">Pending</span>
              </div>
              <div className="text-2xl font-bold">{pendingTasks}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Completion Rate</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {completionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Tasks</p>
                <p className="text-2xl font-bold">{todayTasks.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <ListTodo className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 