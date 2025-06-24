using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class Ticket : BaseEntity
    {
        public Guid UserId { get; set; }
        public Guid? AssignedEmployeeId { get; set; }
        public TicketStatus Status { get; set; } = TicketStatus.Open;
        public string Description { get; set; } = string.Empty;
        public string? AiSuggestedSolution { get; set; }
        public string? FinalSolution { get; set; }

        // Navigation
        public User User { get; set; } = null!;
        public Employee? AssignedEmployee { get; set; }
    }

    public enum TicketStatus
    {
        [Display(Name = "Open")]
        Open = 1,

        [Display(Name = "ResolvedByAI")]
        ResolvedByAI = 2,

        [Display(Name = "AssignedToEmployee ")]
        AssignedToEmployee = 3,

        [Display(Name = "Closed")]
        Closed = 4
    }
}
