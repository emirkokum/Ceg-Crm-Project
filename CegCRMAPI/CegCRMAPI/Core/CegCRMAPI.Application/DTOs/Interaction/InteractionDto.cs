using System;

namespace CegCRMAPI.Application.DTOs.Interaction
{
    public class InteractionDto
    {
        public Guid Id { get; set; }
        public Guid CustomerId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime InteractionDate { get; set; }

        // customer
        public string CustomerFullName { get; set; }
    }
}