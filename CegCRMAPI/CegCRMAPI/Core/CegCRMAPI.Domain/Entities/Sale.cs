using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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
        public SaleStatus Status { get; set; } 
        public string InvoiceNumber { get; set; } = string.Empty;

        // Navigation properties
        public Customer Customer { get; set; } = null!;
        public Employee SalesPerson { get; set; } = null!;
        public ICollection<SaleProduct> SaleProducts { get; set; } = new List<SaleProduct>();

        public enum SaleStatus
        {
            [Display(Name = "Proposal")]
            Proposal = 1,

            [Display(Name = "Negotiation")]
            Negotiation = 2,

            [Display(Name = "Accepted")]
            Accepted = 3,

            [Display(Name = "Rejected")]
            Rejected = 4,

            [Display(Name = "Completed")]
            Completed = 5
        }
    }
}
