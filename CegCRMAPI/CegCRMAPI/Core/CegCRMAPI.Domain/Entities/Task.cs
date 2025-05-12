using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;

namespace CegCRMAPI.Domain.Entities
{
    public class TaskItem : BaseEntity
    {
        public Guid AssignedUserId { get; set; }
        public Guid? CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public string Priority { get; set; } = string.Empty;  // Low, Medium, High
        public string Status { get; set; } = string.Empty;  // Pending, InProgress, Completed, Cancelled
        public string Type { get; set; } = string.Empty;  // Call, Meeting, FollowUp, Other
        
        // Navigation
        public User AssignedUser { get; set; } = null!;
        public Customer? Customer { get; set; }
    }
} 