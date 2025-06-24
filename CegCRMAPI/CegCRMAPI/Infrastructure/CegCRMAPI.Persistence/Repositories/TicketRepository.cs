using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using CegCRMAPI.Persistence.Repositories;

namespace CegCRMAPI.Infrastructure.Repositories
{
    public class TicketRepository : Repository<Ticket>, ITicketRepository
    {
        private readonly CegCrmDbContext _context;
        public TicketRepository(CegCrmDbContext context) : base(context)
        {
            _context = context;
        }
        public async Task<List<Ticket>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
        {
            return await _context.Tickets
                .Where(t => t.UserId == customerId)
                .ToListAsync(cancellationToken);
        }
    }
}