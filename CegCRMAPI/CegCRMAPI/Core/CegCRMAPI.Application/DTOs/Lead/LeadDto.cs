using System;

namespace CegCRMAPI.Application.DTOs.Lead
{
    public class LeadDto
    {
        public Guid Id { get; set; }
        public string? CompanyName { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Industry { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
} 