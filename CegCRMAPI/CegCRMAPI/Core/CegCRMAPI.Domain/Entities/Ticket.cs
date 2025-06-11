using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class Ticket : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public Guid? AssignedEmployeeId { get; set; }
        public TicketStatus Status { get; set; } = TicketStatus.Open;
        public string Description { get; set; } = string.Empty;
        public string? AiSuggestedSolution { get; set; }
        public string? FinalSolution { get; set; }

        // Navigation
        public Customer Customer { get; set; } = null!;
        public Employee? AssignedEmployee { get; set; }
    }

    public enum TicketStatus
    {
        Open,
        ResolvedByAI,
        AssignedToEmployee, 
        Closed  
    }
}
