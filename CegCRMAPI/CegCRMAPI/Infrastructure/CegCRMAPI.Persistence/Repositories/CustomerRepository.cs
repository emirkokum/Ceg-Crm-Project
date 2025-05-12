using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Persistence.Repositories
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        public CustomerRepository(CegCrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Customer>> GetCustomersBySegmentAsync(string segment)
        {
            return await _dbSet
                .Where(c => c.Segment == segment)
                .ToListAsync();
        }

        public async Task<IEnumerable<Customer>> GetCustomersWithInteractionsAsync()
        {
            return await _dbSet
                .Include(c => c.Interactions)
                .ToListAsync();
        }
    }
} 