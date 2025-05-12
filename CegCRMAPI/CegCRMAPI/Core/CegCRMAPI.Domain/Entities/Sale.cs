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
        public DateTime SaleDate { get; set; }
        public Guid CustomerId { get; set; }
        public Guid SalesPersonId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
        public decimal FinalAmount { get; set; }
        public string Status { get; set; } = string.Empty; // Completed, Pending, Cancelled
        public string InvoiceNumber { get; set; } = string.Empty;

        // Navigation properties
        public Customer Customer { get; set; } = null!;
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public User SalesPerson { get; set; } = null!;
    }
}
