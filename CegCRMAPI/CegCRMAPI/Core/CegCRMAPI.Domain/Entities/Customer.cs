using CegCRMAPI.Domain.Entities.Common;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class Customer : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public CustomerType Type { get; set; }

        //For Business
        public string? CompanyName { get; set; }
        public string? TaxNumber { get; set; }
        public string? Sector { get; set; }

        // Navigation
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
        public ICollection<Interaction> Interactions { get; set; } = new List<Interaction>();
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }

    public enum CustomerType
    {
        [Display(Name = "Person")]
        Person = 1,

        [Display(Name = "Business")]
        Business = 2
    }
}
