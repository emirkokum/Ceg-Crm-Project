using CegCRMAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Repositories
{
    public interface INoteRepository : IRepository<Note>
    {
        Task<List<Note>> GetNotesByCustomerIdAsync(Guid customerId);
        Task<List<Note>> GetNotesByLeadIdAsync(Guid leadId);
        Task<List<Note>> GetNotesByTicketIdAsync(Guid ticketId);
        Task<List<Note>> GetNotesBySaleIdAsync(Guid saleId);
        Task<List<Note>> GetNotesByTaskIdAsync(Guid taskId);
    }
} 