using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CegCRMAPI.Persistence.Repositories;
using CegCRMAPI.Application.DTOs.Interaction;

namespace CegCRMAPI.Infrastructure.Repositories
{
    public class InteractionRepository : Repository<Interaction>, IInteractionRepository
    {
        private readonly CegCrmDbContext _context;
        public InteractionRepository(CegCrmDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Interaction>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
        {
            return await _context.Interactions
                .Where(i => i.CustomerId == customerId)
                .ToListAsync(cancellationToken);
        }
    }
} 