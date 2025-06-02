import { useState } from "react";
import { useEmployees, Employee, createEmployee, updateEmployee, deleteEmployee, CreateEmployeeCommand, UpdateEmployeeCommand } from "@/features/hooks/useEmployeeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function EmployeesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const { data: employees = [], isLoading } = useEmployees();

  const queryClient = useQueryClient();
  const createEmployeeMutation = useMutation({ mutationFn: createEmployee });
  const updateEmployeeMutation = useMutation<Employee, Error, { id: string, data: UpdateEmployeeCommand }, unknown>({ mutationFn: ({ id, data }) => updateEmployee(id, data) });
  const deleteEmployeeMutation = useMutation({ mutationFn: deleteEmployee });

  const [newEmployee, setNewEmployee] = useState<CreateEmployeeCommand>({
    userId: "",
    employeeNumber: "",
    hireDate: "",
    workEmail: "",
    workPhone: "",
    annualLeaveDays: 0,
    usedLeaveDays: 0,
    performanceScore: 0,
    emergencyContact: "",
    emergencyPhone: "",
    bankAccount: "",
    taxNumber: "",
  });

  const handleCreateEmployee = async () => {
    try {
      await createEmployeeMutation.mutateAsync(newEmployee);
      toast.success("Employee created successfully!");
      setIsCreateModalOpen(false);
      setNewEmployee({
        userId: "",
        employeeNumber: "",
        hireDate: "",
        workEmail: "",
        workPhone: "",
        annualLeaveDays: 0,
        usedLeaveDays: 0,
        performanceScore: 0,
        emergencyContact: "",
        emergencyPhone: "",
        bankAccount: "",
        taxNumber: "",
      });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (error) {
      toast.error("Failed to create employee.");
      console.error("Create employee error:", error);
    }
  };

  const [editedEmployee, setEditedEmployee] = useState<UpdateEmployeeCommand>({
    id: "",
    employeeNumber: "",
    hireDate: "",
    workEmail: "",
    workPhone: "",
    annualLeaveDays: 0,
    usedLeaveDays: 0,
    performanceScore: 0,
    emergencyContact: "",
    emergencyPhone: "",
    bankAccount: "",
    taxNumber: "",
  });

  const handleUpdateEmployee = async () => {
    if (!employeeToEdit) return;
    try {
      await updateEmployeeMutation.mutateAsync({ id: employeeToEdit.id, data: editedEmployee });
      toast.success("Employee updated successfully!");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (error) {
      toast.error("Failed to update employee.");
      console.error("Update employee error:", error);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployeeMutation.mutateAsync(employeeId);
      toast.success("Employee deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    } catch (error) {
      toast.error("Failed to delete employee.");
      console.error("Delete employee error:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const employeeNumber = employee.employeeNumber?.toLowerCase() || "";
    const workEmail = employee.workEmail?.toLowerCase() || "";
    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();
    const email = employee.email?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = employeeNumber.includes(searchLower) || workEmail.includes(searchLower) || fullName.includes(searchLower) || email.includes(searchLower);
    const matchesFilter = filterTerm === "" ||
                          (employee.department?.toLowerCase().includes(filterTerm.toLowerCase()) || false) ||
                          (employee.role?.toLowerCase().includes(filterTerm.toLowerCase()) || false);

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <Skeleton className="w-full md:w-1/2 h-10" />
          <Skeleton className="w-32 h-10" />
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employees</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Employee
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Input
          placeholder="Filter..."
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
          className="w-full md:w-48"
        />
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Employee Number</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Work Email</th>
              <th className="text-left p-4">Work Phone</th>
              <th className="text-left p-4">Hire Date</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Department</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="p-4">{employee.employeeNumber || "-"}</td>
                <td className="p-4">{`${employee.firstName || ""} ${employee.lastName || ""}`}</td>
                <td className="p-4">{employee.workEmail || employee.email || "-"}</td>
                <td className="p-4">{employee.workPhone || "-"}</td>
                <td className="p-4">{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "-"}</td>
                <td className="p-4">{employee.role || "-"}</td>
                <td className="p-4">{employee.department || "-"}</td>
                <td className="p-4">
                  <Button variant="outline" size="sm" className="mr-2"
                    onClick={() => {
                      setEmployeeToEdit(employee);
                      setIsEditModalOpen(true);
                      setEditedEmployee({
                        id: employee.id,
                        employeeNumber: employee.employeeNumber || "",
                        hireDate: employee.hireDate ? employee.hireDate.split('T')[0] : '',
                        workEmail: employee.workEmail || "",
                        workPhone: employee.workPhone || "",
                        annualLeaveDays: employee.annualLeaveDays,
                        usedLeaveDays: employee.usedLeaveDays,
                        performanceScore: employee.performanceScore,
                        emergencyContact: employee.emergencyContact || "",
                        emergencyPhone: employee.emergencyPhone || "",
                        bankAccount: employee.bankAccount || "",
                        taxNumber: employee.taxNumber || "",
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm"
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this employee?")) {
                        handleDeleteEmployee(employee.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" value={newEmployee.userId} onChange={(e) => setNewEmployee({ ...newEmployee, userId: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input id="employeeNumber" value={newEmployee.employeeNumber} onChange={(e) => setNewEmployee({ ...newEmployee, employeeNumber: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input id="hireDate" type="date" value={newEmployee.hireDate} onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workEmail">Work Email</Label>
                <Input id="workEmail" type="email" value={newEmployee.workEmail} onChange={(e) => setNewEmployee({ ...newEmployee, workEmail: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input id="workPhone" value={newEmployee.workPhone} onChange={(e) => setNewEmployee({ ...newEmployee, workPhone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="annualLeaveDays">Annual Leave Days</Label>
                <Input id="annualLeaveDays" type="number" value={newEmployee.annualLeaveDays} onChange={(e) => setNewEmployee({ ...newEmployee, annualLeaveDays: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="usedLeaveDays">Used Leave Days</Label>
                <Input id="usedLeaveDays" type="number" value={newEmployee.usedLeaveDays} onChange={(e) => setNewEmployee({ ...newEmployee, usedLeaveDays: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performanceScore">Performance Score</Label>
                <Input id="performanceScore" type="number" step="0.1" value={newEmployee.performanceScore} onChange={(e) => setNewEmployee({ ...newEmployee, performanceScore: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" value={newEmployee.emergencyContact} onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContact: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <Input id="emergencyPhone" value={newEmployee.emergencyPhone} onChange={(e) => setNewEmployee({ ...newEmployee, emergencyPhone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bankAccount">Bank Account</Label>
                <Input id="bankAccount" value={newEmployee.bankAccount} onChange={(e) => setNewEmployee({ ...newEmployee, bankAccount: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taxNumber">Tax Number</Label>
                <Input id="taxNumber" value={newEmployee.taxNumber} onChange={(e) => setNewEmployee({ ...newEmployee, taxNumber: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={createEmployeeMutation.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateEmployee} disabled={createEmployeeMutation.isPending}>
                {createEmployeeMutation.isPending ? "Creating..." : "Create Employee"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {employeeToEdit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="editEmployeeNumber">Employee Number</Label>
                  <Input id="editEmployeeNumber" value={editedEmployee.employeeNumber} onChange={(e) => setEditedEmployee({ ...editedEmployee, employeeNumber: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input id="editFirstName" value={employeeToEdit.firstName || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input id="editLastName" value={employeeToEdit.lastName || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input id="editEmail" type="email" value={employeeToEdit.email || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editRole">Role</Label>
                  <Input id="editRole" value={employeeToEdit.role || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editDepartment">Department</Label>
                  <Input id="editDepartment" value={employeeToEdit.department || ""} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editHireDate">Hire Date</Label>
                  <Input id="editHireDate" type="date" value={editedEmployee.hireDate ? editedEmployee.hireDate.split('T')[0] : ''} onChange={(e) => setEditedEmployee({ ...editedEmployee, hireDate: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editWorkEmail">Work Email</Label>
                  <Input id="editWorkEmail" type="email" value={editedEmployee.workEmail} onChange={(e) => setEditedEmployee({ ...editedEmployee, workEmail: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editWorkPhone">Work Phone</Label>
                  <Input id="editWorkPhone" value={editedEmployee.workPhone} onChange={(e) => setEditedEmployee({ ...editedEmployee, workPhone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editAnnualLeaveDays">Annual Leave Days</Label>
                  <Input id="editAnnualLeaveDays" type="number" value={editedEmployee.annualLeaveDays} onChange={(e) => setEditedEmployee({ ...editedEmployee, annualLeaveDays: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editUsedLeaveDays">Used Leave Days</Label>
                  <Input id="editUsedLeaveDays" type="number" value={editedEmployee.usedLeaveDays} onChange={(e) => setEditedEmployee({ ...editedEmployee, usedLeaveDays: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editPerformanceScore">Performance Score</Label>
                  <Input id="editPerformanceScore" type="number" step="0.1" value={editedEmployee.performanceScore} onChange={(e) => setEditedEmployee({ ...editedEmployee, performanceScore: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEmergencyContact">Emergency Contact</Label>
                  <Input id="editEmergencyContact" value={editedEmployee.emergencyContact} onChange={(e) => setEditedEmployee({ ...editedEmployee, emergencyContact: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editEmergencyPhone">Emergency Phone</Label>
                  <Input id="editEmergencyPhone" value={editedEmployee.emergencyPhone} onChange={(e) => setEditedEmployee({ ...editedEmployee, emergencyPhone: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editBankAccount">Bank Account</Label>
                  <Input id="editBankAccount" value={editedEmployee.bankAccount} onChange={(e) => setEditedEmployee({ ...editedEmployee, bankAccount: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="editTaxNumber">Tax Number</Label>
                  <Input id="editTaxNumber" value={editedEmployee.taxNumber} onChange={(e) => setEditedEmployee({ ...editedEmployee, taxNumber: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={updateEmployeeMutation.isPending}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateEmployee} disabled={updateEmployeeMutation.isPending}>
                  {updateEmployeeMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 