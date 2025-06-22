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
import { MoreHorizontal, Trash, Eye, ArrowUpDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteTask } from "../../hooks/useTaskApi";
import { toast } from "sonner";
import { format } from "date-fns";
import { TaskModal } from "./TaskModal";
import { useEnum } from "@/features/hooks/useEnums";

interface TaskTableProps {
  data: Task[];
  onUpdateTask: () => void;
}

export default function TaskTable({ data, onUpdateTask }: TaskTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "dueDate",
      desc: true,
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedTaskForInspect, setSelectedTaskForInspect] =
    useState<Task | null>(null);
  const [editModalTask, setEditModalTask] = useState<Task | null>(null);

  const deleteTask = useDeleteTask();
  const { data: taskStatusOptions } = useEnum("task-status");
  const { data: taskPriorityOptions } = useEnum("task-priority");
  const { data: taskTypeOptions } = useEnum("task-type");

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

  // Helper function to get enum label by value
  const getEnumLabel = (options: any[] | undefined, value: number) => {
    if (!options) return value.toString();
    const option = options.find((opt) => opt.value === value);
    return option?.label || value.toString();
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
        const priorityLabel = getEnumLabel(taskPriorityOptions, task.priority);
        const priorityStyles = {
          Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          Medium:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          High: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
          Critical:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              priorityStyles[priorityLabel as keyof typeof priorityStyles] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {priorityLabel}
          </span>
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
        const statusLabel = getEnumLabel(taskStatusOptions, task.status);
        const statusStyles = {
          Todo: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
          InProgress:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
          Completed:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
          Cancelled:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusStyles[statusLabel as keyof typeof statusStyles] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {statusLabel}
          </span>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const task = row.original;
        const typeLabel = getEnumLabel(taskTypeOptions, task.type);

        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {typeLabel}
          </span>
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
                onClick={() => setEditModalTask(task)}
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
                  {cell.column.id === "actions" ? (
                    <div className="flex items-center gap-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
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
                  {getEnumLabel(
                    taskPriorityOptions,
                    selectedTaskForInspect.priority
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {getEnumLabel(
                    taskStatusOptions,
                    selectedTaskForInspect.status
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Type</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {getEnumLabel(taskTypeOptions, selectedTaskForInspect.type)}
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

      {/* Edit Modal */}
      {editModalTask && (
        <TaskModal
          task={editModalTask}
          onSuccess={() => {
            setEditModalTask(null);
            onUpdateTask();
          }}
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) {
              setEditModalTask(null);
            }
          }}
        />
      )}
    </>
  );
}
