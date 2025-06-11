import { useEffect, useState } from "react";
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
import { getAllTasks } from "@/api/task";
import { Task } from "@/types/task";
import { Progress } from "@/components/ui/progress";

export function TasksTodayCard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getAllTasks();
        if (response.data?.success) {
          setTasks(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === today.getTime();
  });

  const completedTasks = todayTasks.filter(task => task.status === "Completed").length;
  const pendingTasks = todayTasks.length - completedTasks;
  const completionRate = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;

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