using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CegCRMAPI.Domain.Entities
{
    public class TaskItem : BaseEntity
    {
        public Guid AssignedEmployeeId { get; set; }
        public Guid? CustomerId { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }

        public TaskPriority Priority { get; set; }
        public TaskStatus Status { get; set; }
        public TaskType Type { get; set; }

        // Navigation
        public Employee AssignedEmployee { get; set; } = null!;
        public Customer? Customer { get; set; }
    }

    public enum TaskStatus
    {
        [Display(Name = "Todo")]
        Todo = 1,

        [Display(Name = "InProgress ")]
        InProgress = 2,

        [Display(Name = "Completed")]
        Completed = 3,

        [Display(Name = "Cancelled")]
        Cancelled = 4
    }

    public enum TaskPriority
    {
        [Display(Name = "Low")]
        Low = 1,

        [Display(Name = "Medium")]
        Medium = 2,

        [Display(Name = "High")]
        High = 3,

        [Display(Name = "Critical")]
        Critical = 4
    }

    public enum TaskType
    {
        [Display(Name = "Call")]
        Call = 1,

        [Display(Name = "Mail")]
        Email = 2,

        [Display(Name = "Meeting")]
        Meeting = 3,

        [Display(Name = "Followup")]
        FollowUp = 4,

        [Display(Name = "Diðer")]
        Other = 5
    }

}