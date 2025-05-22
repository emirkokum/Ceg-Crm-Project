using System;

namespace CegCRMAPI.Application.DTOs.Ticket
{
    public class TicketDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public Guid? AssignedEmployeeId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Solution { get; set; }
    }
} 