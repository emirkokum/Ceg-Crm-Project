using System;

namespace CegCRMAPI.Application.DTOs.Ticket
{
    public class TicketDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string Description { get; set; } = string.Empty;
        public string? AiSuggestedSolution { get; set; }
        public string? FinalSolution { get; set; }
        public string Status { get; set; } = string.Empty;
        public Guid? AssignedEmployeeId { get; set; }
    }
} 