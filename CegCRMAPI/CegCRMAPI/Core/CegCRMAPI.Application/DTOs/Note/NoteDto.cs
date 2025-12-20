using System;

namespace CegCRMAPI.Application.DTOs.Note
{
    public class NoteDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public Guid? CustomerId { get; set; }
        public Guid? LeadId { get; set; }
        public Guid? TicketId { get; set; }
        public Guid? SaleId { get; set; }
        public Guid? TaskId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
} 