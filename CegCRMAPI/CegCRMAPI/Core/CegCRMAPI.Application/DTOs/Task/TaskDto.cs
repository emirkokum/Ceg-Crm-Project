using System;

namespace CegCRMAPI.Application.DTOs.Task
{
    public class TaskDto
    {
        public Guid Id { get; set; }
        public Guid AssignedUserId { get; set; }
        public Guid? CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
} 