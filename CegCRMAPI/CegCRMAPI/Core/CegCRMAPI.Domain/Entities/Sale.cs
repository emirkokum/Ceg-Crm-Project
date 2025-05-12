using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class Sale : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string OfferDetails { get; set; } = string.Empty;

        // Navigation
        public Customer Customer { get; set; } = null!;
    }
}
