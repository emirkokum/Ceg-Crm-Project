using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Persistence.Repositories
{
    public class LeadRepository : Repository<Lead>, ILeadRepository
    {
        public LeadRepository(CegCrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Lead>> GetLeadsByStatusAsync(string status)
        {
            return await _context.Leads
                .Where(l => l.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Lead>> GetLeadsBySourceAsync(string source)
        {
            return await _context.Leads
                .Where(l => l.Source == source)
                .ToListAsync();
        }

        public async Task<IEnumerable<Lead>> GetLeadsWithInteractionsAsync()
        {
            return await _context.Leads
                .Include(l => l.Interactions)
                .ToListAsync();
        }
    }
} 