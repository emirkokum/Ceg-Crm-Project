import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import SearchableSelect from "@/components/SearchableSelect";
import DateTimePicker from "@/components/DateTimePicker";
import { useCreateTask, useUpdateTask } from "@/features/hooks/useTaskApi";
import { Customer } from "@/types/customer";
import { useEnum } from "@/features/hooks/useEnums";
import { EnumSelect } from "@/components/EnumSelect";
import { TaskStatus, TaskPriority, TaskType } from "@/constants/enums";
import { Task } from "@/types/task";

interface TaskModalProps {
  task?: Task; // Optional - if provided, it's update mode
  onSuccess: () => void;
  trigger?: React.ReactNode; // Optional custom trigger
  isOpen?: boolean; // Optional - if provided, controls the modal state externally
  onOpenChange?: (open: boolean) => void; // Optional - callback for external state control
}

export function TaskModal({ task, onSuccess, trigger, isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }: TaskModalProps) {
  const isUpdateMode = !!task;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;
  const [formData, setFormData] = useState<{
    assignedEmployeeId: string;
    customerId: string;
    title: string;
    description: string;
    dueDate: string;
    priority: number;
    status: number;
    type: number;
  }>({
    assignedEmployeeId: "",
    customerId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: TaskPriority.Low,
    status: TaskStatus.Todo,
    type: TaskType.Other,
  });

  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees();
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();
  const { data: taskStatusOptions } = useEnum("task-status");
  const { data: taskPriorityOptions } = useEnum("task-priority");
  const { data: taskTypeOptions } = useEnum("task-type");
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  // Initialize form data when task changes (for update mode)
  useEffect(() => {
    if (task) {
      setFormData({
        assignedEmployeeId: task.assignedEmployeeId || "",
        customerId: task.customerId || "",
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate || "",
        priority: task.priority || TaskPriority.Low,
        status: task.status || TaskStatus.Todo,
        type: task.type || TaskType.Other,
      });
    } else {
      // Reset form for create mode
      setFormData({
        assignedEmployeeId: "",
        customerId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: TaskPriority.Low,
        status: TaskStatus.Todo,
        type: TaskType.Other,
      });
    }
  }, [task]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (isUpdateMode && task) {
        await updateTask.mutateAsync({
          id: task.id,
          data: formData,
        });
        toast.success("Task updated successfully");
      } else {
        await createTask.mutateAsync(formData);
        toast.success("Task created successfully");
      }
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      toast.error(`Error ${isUpdateMode ? 'updating' : 'creating'} task`);
    }
  };

  const isLoading = createTask.isPending || updateTask.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {isUpdateMode ? (
              <Pencil className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {isUpdateMode ? "Edit" : "New Task"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? "Update Task" : "New Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium">Assigned Employee</label>
              <SearchableSelect
                options={employees.map((employee) => ({
                  value: employee.id,
                  label: `${employee.user.firstName} ${employee.user.lastName}`,
                }))}
                value={formData.assignedEmployeeId}
                onChange={(val) =>
                  setFormData((f) => ({ ...f, assignedEmployeeId: val }))
                }
                placeholder="Select employee"
                emptyText="No employee matched."
                searchable={true}
                disabled={isLoadingEmployees}
              />
            </div>

            <div className="col-span-2">
              <label className="text-sm font-medium">Customer (Optional)</label>
              <SearchableSelect
                options={customers.map((c: Customer) => ({
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
                disabled={isLoadingCustomers}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <EnumSelect
                options={taskPriorityOptions || []}
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, priority: value }))
                }
                placeholder="Select Priority"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <EnumSelect
                options={taskStatusOptions || []}
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, status: value }))
                }
                placeholder="Select Status"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <EnumSelect
                options={taskTypeOptions || []}
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((f) => ({ ...f, type: value }))
                }
                placeholder="Select Type"
              />
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
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading 
                ? (isUpdateMode ? "Updating..." : "Creating...") 
                : (isUpdateMode ? "Update" : "Create")
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 