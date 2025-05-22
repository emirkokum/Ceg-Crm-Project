using CegCRMAPI.Application.DTOs.Auth;
using System;

namespace CegCRMAPI.Application.DTOs.Employee
{
    public class EmployeeDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string EmployeeNumber { get; set; }
        public DateTime HireDate { get; set; }
        public string WorkEmail { get; set; }
        public string WorkPhone { get; set; }
        public int AnnualLeaveDays { get; set; }
        public int UsedLeaveDays { get; set; }
        public decimal PerformanceScore { get; set; }
        public string EmergencyContact { get; set; }
        public string EmergencyPhone { get; set; }
        public string BankAccount { get; set; }
        public string TaxNumber { get; set; }

        // Navigation property
        public UserDto User { get; set; }
    }
} 