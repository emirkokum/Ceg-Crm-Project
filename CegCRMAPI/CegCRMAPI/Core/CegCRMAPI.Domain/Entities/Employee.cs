using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace CegCRMAPI.Domain.Entities
{
    public class Employee : BaseEntity
    {
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public string EmployeeNumber { get; set; }
        public DateTime HireDate { get; set; }
        public decimal Salary { get; set; }
        public string WorkPhone { get; set; }
        public string WorkEmail { get; set; }

        
        public ICollection<Customer> AssignedCustomers { get; set; } = new List<Customer>();
        public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();


        
        public int AnnualLeaveDays { get; set; }
        public int UsedLeaveDays { get; set; }
        public decimal PerformanceScore { get; set; }
        
        // Diğer iş süreçleri için gerekli alanlar
        public string EmergencyContact { get; set; }
        public string EmergencyPhone { get; set; }
        public string BankAccount { get; set; }
        public string TaxNumber { get; set; }
    }
} 