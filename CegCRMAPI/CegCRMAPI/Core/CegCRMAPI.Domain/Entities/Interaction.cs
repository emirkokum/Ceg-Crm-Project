using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
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

        public enum InteractionType
        {
            [Display(Name = "Call")]
            Call = 1,
            [Display(Name = "Email")]
            Email = 2,
            [Display(Name = "Meeting")]
            Meeting = 3,
            [Display(Name = "Message")]
            Message = 4,
            [Display(Name = "Other")]
            Other = 5
        }
    }
}
