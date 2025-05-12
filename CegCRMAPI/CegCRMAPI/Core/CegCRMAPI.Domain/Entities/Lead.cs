using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;

namespace CegCRMAPI.Domain.Entities
{
    public class Lead : BaseEntity
    {
        public string? CompanyName { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;  // Website, Referral, Social Media, Other
        public string Status { get; set; } = string.Empty;  // New, Contacted, Qualified, Converted, Lost
        public string Industry { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        
        // Navigation
        public ICollection<Interaction> Interactions { get; set; } = new List<Interaction>();
    }
} 