using CegCRMAPI.Domain.Entities;
using System;

namespace CegCRMAPI.Application.DTOs.Task
{
    public class TaskDto
    {
        public Guid Id { get; set; }
        public Guid AssignedEmployeeId { get; set; }
        public Guid? CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public TaskPriority Priority { get; set; }
        public Domain.Entities.TaskStatus Status { get; set; }
        public TaskType Type { get; set; }
    }
} 