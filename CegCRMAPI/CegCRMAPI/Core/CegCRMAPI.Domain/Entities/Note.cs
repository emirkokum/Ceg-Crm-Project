using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class Note : BaseEntity
    {
        public string Content { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? TicketId { get; set; }
        public Guid? SaleId { get; set; }
        public Guid? TaskId { get; set; }


        // Navigation
        public Lead? Lead { get; set; }
        public Customer? Customer { get; set; }
        public Ticket? Ticket { get; set; }
        public Sale? Sale { get; set; }
        public Domain.Entities.TaskItem? Task { get; set; }
    }
}
