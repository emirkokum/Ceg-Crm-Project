using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class Interaction : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime InteractionDate { get; set; }

        // Navigation
        public Customer Customer { get; set; } = null!;
    }
}
