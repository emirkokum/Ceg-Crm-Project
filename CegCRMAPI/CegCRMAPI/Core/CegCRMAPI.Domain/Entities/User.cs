using CegCRMAPI.Domain.Entities.Common;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities
{
    public class User : IdentityUser<Guid>
    {
        // Temel bilgiler
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;

        // Çalışan bilgileri
        public string Department { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime HireDate { get; set; }
        public bool IsActive { get; set; } = true;

        // İlişkiler
        public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}
