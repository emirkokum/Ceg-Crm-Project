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
        public Guid? AssignedUserId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Solution { get; set; }

        // Navigation
        public Customer Customer { get; set; } = null!;
        public User? AssignedUser { get; set; }
    }
}
