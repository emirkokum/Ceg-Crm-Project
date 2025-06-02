import { useState } from "react";
import {
  useTasks,
  useCreateTask,
} from "@/features/hooks/useTaskApi";
import TaskTable from "../components/TaskTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsers } from "../../hooks/useUserApi";
import type { User } from "../../hooks/useUserApi";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/SearchableSelect";
import DateTimePicker from "@/components/DateTimePicker";

export default function TasksPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    assignedUserId: "",
    customerId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
    type: "",
  });

  const [titleFilter, setTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const { data: tasks = [], isLoading } = useTasks();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const createTask = useCreateTask();

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createTask.mutateAsync(formData);
      toast.success("Task created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        assignedUserId: "",
        customerId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "",
        type: "",
      });
    } catch (error) {
      toast.error("Error creating task");
    }
  };

  if (isLoading || isLoadingUsers || isLoadingCustomers) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
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

  const filteredTasks = tasks.filter((task) => {
    const title = task.title ?? "";
    const status = task.status ?? "";
    const priority = task.priority ?? "";

    const matchesTitle = title
      .toLowerCase()
      .includes(titleFilter.toLowerCase());
    const matchesStatus = statusFilter === "" || status === statusFilter;
    const matchesPriority = priorityFilter === "" || priority === priorityFilter;

    return matchesTitle && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
        <Input
          placeholder="Search With Title..."
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Select
          onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
          value={statusFilter || "all"}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(val) => setPriorityFilter(val === "all" ? "" : val)}
          value={priorityFilter || "all"}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <TaskTable data={filteredTasks} />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Assigned User</label>
                <SearchableSelect
                  options={users.map((u: User) => ({
                    value: u.id,
                    label: `${u.firstName} ${u.lastName}`,
                  }))}
                  value={formData.assignedUserId}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, assignedUserId: val }))
                  }
                  placeholder="Select user"
                  emptyText="No user matched."
                  searchable={true}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Customer (Optional)</label>
                <SearchableSelect
                  options={customers.map((c) => ({
                    value: c.id,
                    label: `${c.firstName} ${c.lastName}`,
                  }))}
                  value={formData.customerId}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, customerId: val }))
                  }
                  placeholder="Select customer"
                  emptyText="No customer matched."
                  searchable={true}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={formData.priority}
                  onValueChange={(val) =>
                    setFormData((f) => ({ ...f, priority: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData((f) => ({ ...f, status: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData((f) => ({ ...f, type: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Call">Call</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Due Date</label>
                <DateTimePicker
                  value={formData.dueDate}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: val,
                    }))
                  }
                  placeholder="Select date and time"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createTask.isPending}
              >
                {createTask.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 