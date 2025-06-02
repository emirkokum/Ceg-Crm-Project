import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/types/task";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye, CalendarIcon, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useUpdateTask,
  useDeleteTask,
} from "../../hooks/useTaskApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import DateTimePicker from "@/components/DateTimePicker";

interface TaskTableProps {
  data: Task[];
}

interface UpdateFormData {
  assignedUserId: string;
  customerId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  type: string;
}

export default function TaskTable({ data }: TaskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "dueDate",
      desc: true
    }
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedTaskForInspect, setSelectedTaskForInspect] = useState<Task | null>(null);
  const [formData, setFormData] = useState<UpdateFormData>({
    assignedUserId: "",
    customerId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "",
    type: "",
  });

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleUpdate = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      assignedUserId: task.assignedUserId,
      customerId: task.customerId || "",
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      type: task.type,
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask.mutateAsync(selectedTask.id);
      toast.success("Task deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting task");
    }
  };

  const handleInspectClick = (task: Task) => {
    setSelectedTaskForInspect(task);
    setIsInspectModalOpen(true);
  };

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
    if (!selectedTask) return;

    try {
      await updateTask.mutateAsync({
        id: selectedTask.id,
        data: formData as Omit<Task, "id">,
      });
      toast.success("Task updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating task");
    }
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.original.title,
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const task = row.original;
        const priorityStyles = {
          Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={`h-8 px-2 hover:bg-muted cursor-pointer ${priorityStyles[task.priority as keyof typeof priorityStyles]}`}
              >
                {task.priority}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  updateTask.mutate(
                    {
                      id: task.id,
                      data: { ...task, priority: "Low" },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Priority updated successfully");
                      },
                      onError: () => {
                        toast.error("Error updating priority");
                      },
                    }
                  );
                }}
              >
                Low
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateTask.mutate(
                    {
                      id: task.id,
                      data: { ...task, priority: "Medium" },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Priority updated successfully");
                      },
                      onError: () => {
                        toast.error("Error updating priority");
                      },
                    }
                  );
                }}
              >
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateTask.mutate(
                    {
                      id: task.id,
                      data: { ...task, priority: "High" },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Priority updated successfully");
                      },
                      onError: () => {
                        toast.error("Error updating priority");
                      },
                    }
                  );
                }}
              >
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const task = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 hover:bg-muted cursor-pointer"
              >
                {task.status}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => {
                  updateTask.mutate(
                    {
                      id: task.id,
                      data: { ...task, status: "Not Started" },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Status updated successfully");
                      },
                      onError: () => {
                        toast.error("Error updating status");
                      },
                    }
                  );
                }}
              >
                Not Started
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateTask.mutate(
                    {
                      id: task.id,
                      data: { ...task, status: "In Progress" },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Status updated successfully");
                      },
                      onError: () => {
                        toast.error("Error updating status");
                      },
                    }
                  );
                }}
              >
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  updateTask.mutate(
                    {
                      id: task.id,
                      data: { ...task, status: "Completed" },
                    },
                    {
                      onSuccess: () => {
                        toast.success("Status updated successfully");
                      },
                      onError: () => {
                        toast.error("Error updating status");
                      },
                    }
                  );
                }}
              >
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.dueDate);
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      id: "inspect",
      header: "Inspect",
      cell: ({ row }) => {
        const task = row.original;
        return (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => handleInspectClick(task)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleUpdate(task)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(task)}
                className="cursor-pointer text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={updateTask.isPending}
                >
                  {updateTask.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspect Modal */}
      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Task Details</DialogTitle>
          </DialogHeader>

          {selectedTaskForInspect && (
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Title</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {selectedTaskForInspect.title}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Description</p>
                <div className="bg-muted px-3 py-2 rounded whitespace-pre-wrap">
                  {selectedTaskForInspect.description}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Priority</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {selectedTaskForInspect.priority}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {selectedTaskForInspect.status}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Type</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {selectedTaskForInspect.type}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Due Date</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {format(
                    new Date(selectedTaskForInspect.dueDate),
                    "dd.MM.yyyy HH:mm"
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 