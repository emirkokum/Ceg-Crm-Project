using CegCRMAPI.Domain.Entities.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CegCRMAPI.Domain.Entities
{
    public class Lead : BaseEntity
    {
        public string? CompanyName { get; set; }
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public LeadSource Source { get; set; }
        public LeadStatus Status { get; set; }
        public IndustryType Industry { get; set; }
        public bool IsConverted { get; set; } = false;


        // Navigation
        public ICollection<Note> Notes { get; set; }
        public ICollection<Interaction> Interactions { get; set; } = new List<Interaction>();
    }

    public enum LeadSource
    {
        [Display(Name = "Website")]
        Website = 1,

        [Display(Name = "Referral")]
        Referral = 2,

        [Display(Name = "Event")]
        Event = 3,

        [Display(Name = "Email")]
        Email = 4,

        [Display(Name = "ColdCall")]
        ColdCall = 5,

        [Display(Name = "Other")]
        Other = 6
    }

    public enum LeadStatus
    {
        [Display(Name = "New")]
        New = 1,

        [Display(Name = "InProgress")]
        InProgress = 2,

        [Display(Name = "Contacted")]
        Contacted = 3,

        [Display(Name = "Qualified")]
        Qualified = 4,

        [Display(Name = "Lost")]
        Lost = 5,

        [Display(Name = "Converted")]
        Converted = 6
    }

    public enum IndustryType
    {
        [Display(Name = "Technology")]
        Technology = 1,

        [Display(Name = "Finance")]
        Finance = 2,

        [Display(Name = "Health")]
        Health = 3,

        [Display(Name = "Retail")]
        Retail = 4,

        [Display(Name = "Education")]
        Education = 5,

        [Display(Name = "Other")]
        Other = 6
    }   
} 