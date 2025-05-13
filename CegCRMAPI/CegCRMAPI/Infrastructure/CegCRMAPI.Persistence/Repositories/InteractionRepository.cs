using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.Infrastructure.Repositories
{
    public class InteractionRepository : IInteractionRepository
    {
        private readonly CegCrmDbContext _context;

        public InteractionRepository(CegCrmDbContext context)
        {
            _context = context;
        }

        public async Task<Interaction> GetByIdAsync(Guid id)
        {
            return await _context.Interactions
                .Include(i => i.Customer)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<IEnumerable<Interaction>> GetAllInteractionsAsync()
        {
            return await _context.Interactions
                .Include(i => i.Customer)
                .OrderByDescending(i => i.InteractionDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Interaction>> GetInteractionsByCustomerIdAsync(Guid customerId)
        {
            return await _context.Interactions
                .Include(i => i.Customer)
                .Where(i => i.CustomerId == customerId)
                .OrderByDescending(i => i.InteractionDate)
                .ToListAsync();
        }

        public async Task<Interaction> CreateAsync(Interaction interaction)
        {
            interaction.InteractionDate = DateTime.UtcNow;
            await _context.Interactions.AddAsync(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }

        public async Task<Interaction> UpdateAsync(Interaction interaction)
        {
            _context.Interactions.Update(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var interaction = await _context.Interactions.FindAsync(id);
            if (interaction == null)
                return false;

            _context.Interactions.Remove(interaction);
            await _context.SaveChangesAsync();
            return true;
        }
    }
} 