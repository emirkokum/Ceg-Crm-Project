import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployee, CreateEmployeeCommand } from "@/features/hooks/useEmployeeApi";
import { useUsers } from "@/features/hooks/useUserApi";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DateTimePicker from '@/components/DateTimePicker';
import { cn } from "@/lib/utils";

interface AddEmployeeModalProps {
  onSuccess: () => void;
}

export function AddEmployeeModal({ onSuccess }: AddEmployeeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const createEmployeeMutation = useMutation({ mutationFn: createEmployee });
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();

  // Only show users with role 'customer' (case-insensitive)
  const customerOptions = users.filter(user => 
    user.role?.toLowerCase() === 'customer'
  );

  const [formData, setFormData] = useState<CreateEmployeeCommand>({
    userId: "",
    hireDate: "",
    annualLeaveDays: 0,
    usedLeaveDays: 0,
    performanceScore: 0,
    salary: 0,
    workEmail: undefined,
    workPhone: undefined,
    emergencyContact: undefined,
    emergencyPhone: undefined,
    bankAccount: undefined,
    taxNumber: undefined,
  });

  const selectedUser = users.find(user => user.id === formData.userId);

  const resetFormData = () => {
    setFormData({
      userId: "",
      hireDate: "",
      annualLeaveDays: 0,
      usedLeaveDays: 0,
      performanceScore: 0,
      salary: 0,
      workEmail: undefined,
      workPhone: undefined,
      emergencyContact: undefined,
      emergencyPhone: undefined,
      bankAccount: undefined,
      taxNumber: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEmployeeMutation.mutateAsync(formData);
      toast.success("Employee created successfully!");
      onSuccess();
      setIsOpen(false);
      resetFormData();
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          typeof error.response.data === 'object' && error.response.data && 'message' in error.response.data) {
        toast.error(String(error.response.data.message) || "Error creating employee");
      } else {
        toast.error("Error creating employee");
      }
    }
  };

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setFormData(prev => ({
      ...prev,
      userId,
      workEmail: user?.email || undefined,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  // Add this CSS class near the top of the component
  const noSpinnerClass = "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Select User *</Label>
              <SearchableSelect
                options={customerOptions.map((user) => ({
                  value: user.id,
                  label: `${user.firstName} ${user.lastName} (${user.email})`,
                }))}
                value={formData.userId}
                onChange={handleUserSelect}
                placeholder="Search and select a user..."
                emptyText="No users found."
                disabled={isLoadingUsers}
              />
            </div>

            {selectedUser && (
              <div className="col-span-2 grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                  <p className="text-sm">{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <p className="text-sm">{selectedUser.role || "Not assigned"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                  <p className="text-sm">{selectedUser.department || "Not assigned"}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <DateTimePicker
                value={formData.hireDate}
                onChange={(val) => setFormData({ ...formData, hireDate: val })}
                placeholder="Select hire date and time"
                okText="OK"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workEmail">Work Email</Label>
              <Input
                id="workEmail"
                name="workEmail"
                type="email"
                value={formData.workEmail}
                onChange={handleChange}
                placeholder="Enter work email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workPhone">Work Phone</Label>
              <Input
                id="workPhone"
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
                placeholder="Enter work phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualLeaveDays">Annual Leave Days</Label>
              <Input
                id="annualLeaveDays"
                name="annualLeaveDays"
                type="number"
                value={formData.annualLeaveDays}
                onChange={(e) => setFormData({ ...formData, annualLeaveDays: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usedLeaveDays">Used Leave Days</Label>
              <Input
                id="usedLeaveDays"
                name="usedLeaveDays"
                type="number"
                value={formData.usedLeaveDays}
                onChange={(e) => setFormData({ ...formData, usedLeaveDays: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
                className={cn(noSpinnerClass)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="performanceScore">Performance Score</Label>
              <Input
                id="performanceScore"
                name="performanceScore"
                type="number"
                step="0.01"
                value={formData.performanceScore}
                onChange={(e) => setFormData({ ...formData, performanceScore: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                className={cn(noSpinnerClass)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Emergency contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Phone</Label>
              <Input
                id="emergencyPhone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                placeholder="Emergency contact phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Input
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="Bank account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">Tax Number</Label>
              <Input
                id="taxNumber"
                name="taxNumber"
                value={formData.taxNumber}
                onChange={handleChange}
                placeholder="Tax identification number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEmployeeMutation.isPending || !formData.userId || !formData.hireDate}
            >
              {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 