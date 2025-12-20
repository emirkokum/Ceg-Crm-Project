import { useState, useMemo } from "react";
import {
  useTasks,
} from "@/features/hooks/useTaskApi";
import TaskTable from "../components/TaskTable";
import { Button } from "@/components/ui/button";
import {  Users, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { TaskModal } from "../components/TaskModal";
import { Card, CardContent } from "@/components/ui/card";
import { useEnum } from "@/features/hooks/useEnums";
import { EnumSelect } from "@/components/EnumSelect";

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useTasks();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { data: taskStatusOptions } = useEnum("task-status");
  const { data: taskPriorityOptions } = useEnum("task-priority");

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return [];
    }
    return tasks.filter((task) => {
      const title = task.title ?? "";
      const description = task.description ?? "";
      const status = task.status;
      const priority = task.priority;

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === null || status === statusFilter;
      const matchesPriority = priorityFilter === null || priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleExport = () => {
    toast.info("Export functionality coming soon!");
  };

  if (isLoading || isLoadingCustomers) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <Skeleton className="w-full md:w-1/2 h-10" />
          <div className="flex gap-2">
            <Skeleton className="w-32 h-10" />
            <Skeleton className="w-32 h-10" />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <Skeleton className="w-full md:w-48 h-10" />
          <Skeleton className="w-full md:w-48 h-10" />
          <Skeleton className="w-full md:w-48 h-10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    );
  }

  if (isError)
    return (
      <Card className="p-6">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <div className="text-red-500 text-xl">Error fetching data</div>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );

  const allStatusOptions = [
    { value: 0, label: "All Statuses" },
    ...(taskStatusOptions || []),
  ];

  const allPriorityOptions = [
    { value: 0, label: "All Priorities" },
    ...(taskPriorityOptions || []),
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Tasks</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <TaskModal onSuccess={refetch} />
        </div>
      </div>

      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search (title or description)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <EnumSelect
                options={allStatusOptions}
                value={statusFilter ?? 0}
                onValueChange={(value) =>
                  setStatusFilter(value === 0 ? null : value)
                }
                placeholder="Filter by status"
              />
              <EnumSelect
                options={allPriorityOptions}
                value={priorityFilter ?? 0}
                onValueChange={(value) =>
                  setPriorityFilter(value === 0 ? null : value)
                }
                placeholder="Filter by priority"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-10 py-5">
          <TaskTable data={filteredTasks} onUpdateTask={refetch} />
        </CardContent>
      </Card>
    </div>
  );
} 