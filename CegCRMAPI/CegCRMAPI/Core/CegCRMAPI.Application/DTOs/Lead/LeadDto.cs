using CegCRMAPI.Domain.Entities;
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
        public LeadSource Source { get; init; }
        public LeadStatus Status { get; init; }
        public IndustryType Industry { get; init; }

        public string Notes { get; set; } = string.Empty;
    }
} 