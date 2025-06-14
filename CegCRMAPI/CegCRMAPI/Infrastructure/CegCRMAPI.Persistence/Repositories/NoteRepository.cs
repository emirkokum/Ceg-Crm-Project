using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Persistence.Repositories
{
    public class NoteRepository : Repository<Note>, INoteRepository
    {
        public NoteRepository(CegCrmDbContext context) : base(context)
        {
        }

        public async Task<List<Note>> GetNotesByCustomerIdAsync(Guid customerId)
        {
            return await _context.Notes
                .Where(n => n.CustomerId == customerId)
                .ToListAsync();
        }

        public async Task<List<Note>> GetNotesByLeadIdAsync(Guid leadId)
        {
            return await _context.Notes
                .Where(n => n.LeadId == leadId)
                .ToListAsync();
        }

        public async Task<List<Note>> GetNotesByTicketIdAsync(Guid ticketId)
        {
            return await _context.Notes
                .Where(n => n.TicketId == ticketId)
                .ToListAsync();
        }

        public async Task<List<Note>> GetNotesBySaleIdAsync(Guid saleId)
        {
            return await _context.Notes
                .Where(n => n.SaleId == saleId)
                .ToListAsync();
        }

        public async Task<List<Note>> GetNotesByTaskIdAsync(Guid taskId)
        {
            return await _context.Notes
                .Where(n => n.TaskId == taskId)
                .ToListAsync();
        }
    }
} 