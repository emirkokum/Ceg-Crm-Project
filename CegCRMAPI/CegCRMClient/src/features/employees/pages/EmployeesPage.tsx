import { useState } from "react";
import { useEmployees, Employee, updateEmployee, deleteEmployee, UpdateEmployeeCommand } from "@/features/hooks/useEmployeeApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AddEmployeeModal } from "../components/AddEmployeeModal";
import DateTimePicker from '@/components/DateTimePicker';
import { cn } from "@/lib/utils";
import { Users as UsersIcon, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const noSpinnerClass = "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const { data: employees = [], isLoading, refetch } = useEmployees();

  const queryClient = useQueryClient();
  const updateEmployeeMutation = useMutation<Employee, Error, { id: string, data: UpdateEmployeeCommand }, unknown>({ mutationFn: ({ id, data }) => updateEmployee(id, data) });
  const deleteEmployeeMutation = useMutation({ mutationFn: deleteEmployee });

  const [editedEmployee, setEditedEmployee] = useState<UpdateEmployeeCommand>({
    id: "",
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
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete employee.");
      console.error("Delete employee error:", error);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const fullName = `${employee.user?.firstName || ""} ${employee.user?.lastName || ""}`.toLowerCase();
    const email = employee.user?.email?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = fullName.includes(searchLower) || email.includes(searchLower);
    const matchesRole = roleFilter === "" || employee.user?.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Employees</h1>
        </div>
        <div className="flex gap-2">
          <AddEmployeeModal onSuccess={refetch} />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select
                onValueChange={(val) => setRoleFilter(val === "all" ? "" : val)}
                value={roleFilter || "all"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="SalesPerson">Sales Person</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="BaseUser">Base User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardContent className="px-10 py-5">
          <div className="border rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Employee Number</th>
                  <th className="text-left p-4">Hire Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="p-4">{`${employee.user?.firstName || ""} ${employee.user?.lastName || ""}`}</td>
                    <td className="p-4">{employee.user?.email || "-"}</td>
                    <td className="p-4">{employee.user?.role || "-"}</td>
                    <td className="p-4">{employee.employeeNumber || "-"}</td>
                    <td className="p-4">{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : "-"}</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm" className="mr-2"
                        onClick={() => {
                          setEmployeeToEdit(employee);
                          setIsEditModalOpen(true);
                          setEditedEmployee({
                            id: employee.id,
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
                          setEmployeeToDelete(employee);
                          setIsDeleteModalOpen(true);
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
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {employeeToEdit && (
            <form onSubmit={e => { e.preventDefault(); handleUpdateEmployee(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-sm">{`${employeeToEdit.user?.firstName || ''} ${employeeToEdit.user?.lastName || ''}`}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{employeeToEdit.user?.email || ''}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                    <p className="text-sm">{employeeToEdit.user?.role || 'Not assigned'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editHireDate">Hire Date *</Label>
                  <DateTimePicker
                    value={editedEmployee.hireDate}
                    onChange={val => setEditedEmployee({ ...editedEmployee, hireDate: val })}
                    placeholder="Select hire date and time"
                    okText="OK"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWorkEmail">Work Email</Label>
                  <Input
                    id="editWorkEmail"
                    name="workEmail"
                    type="email"
                    value={editedEmployee.workEmail}
                    onChange={e => setEditedEmployee({ ...editedEmployee, workEmail: e.target.value })}
                    placeholder="Enter work email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editWorkPhone">Work Phone</Label>
                  <Input
                    id="editWorkPhone"
                    name="workPhone"
                    value={editedEmployee.workPhone}
                    onChange={e => setEditedEmployee({ ...editedEmployee, workPhone: e.target.value })}
                    placeholder="Enter work phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAnnualLeaveDays">Annual Leave Days</Label>
                  <Input
                    id="editAnnualLeaveDays"
                    name="annualLeaveDays"
                    type="number"
                    value={editedEmployee.annualLeaveDays}
                    onChange={e => setEditedEmployee({ ...editedEmployee, annualLeaveDays: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editUsedLeaveDays">Used Leave Days</Label>
                  <Input
                    id="editUsedLeaveDays"
                    name="usedLeaveDays"
                    type="number"
                    value={editedEmployee.usedLeaveDays}
                    onChange={e => setEditedEmployee({ ...editedEmployee, usedLeaveDays: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPerformanceScore">Performance Score</Label>
                  <Input
                    id="editPerformanceScore"
                    name="performanceScore"
                    type="number"
                    step="0.01"
                    value={editedEmployee.performanceScore}
                    onChange={e => setEditedEmployee({ ...editedEmployee, performanceScore: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className={cn(noSpinnerClass)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmergencyContact">Emergency Contact</Label>
                  <Input
                    id="editEmergencyContact"
                    name="emergencyContact"
                    value={editedEmployee.emergencyContact}
                    onChange={e => setEditedEmployee({ ...editedEmployee, emergencyContact: e.target.value })}
                    placeholder="Emergency contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmergencyPhone">Emergency Phone</Label>
                  <Input
                    id="editEmergencyPhone"
                    name="emergencyPhone"
                    value={editedEmployee.emergencyPhone}
                    onChange={e => setEditedEmployee({ ...editedEmployee, emergencyPhone: e.target.value })}
                    placeholder="Emergency contact phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editBankAccount">Bank Account</Label>
                  <Input
                    id="editBankAccount"
                    name="bankAccount"
                    value={editedEmployee.bankAccount}
                    onChange={e => setEditedEmployee({ ...editedEmployee, bankAccount: e.target.value })}
                    placeholder="Bank account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editTaxNumber">Tax Number</Label>
                  <Input
                    id="editTaxNumber"
                    name="taxNumber"
                    value={editedEmployee.taxNumber}
                    onChange={e => setEditedEmployee({ ...editedEmployee, taxNumber: e.target.value })}
                    placeholder="Tax identification number"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={updateEmployeeMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateEmployeeMutation.isPending || !editedEmployee.hireDate}
                >
                  {updateEmployeeMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this employee?</p>
            {employeeToDelete && (
              <p className="mt-2 text-sm text-muted-foreground">
                {`${employeeToDelete.user?.firstName} ${employeeToDelete.user?.lastName}`}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteEmployeeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteEmployeeMutation.isPending}
              onClick={() => employeeToDelete && handleDeleteEmployee(employeeToDelete.id)}
            >
              {deleteEmployeeMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 