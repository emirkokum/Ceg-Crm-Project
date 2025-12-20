using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Infrastructure.Repositories 
{
    public class SaleRepository : Repository<Sale>, ISaleRepository
    {
        public SaleRepository(CegCrmDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<Sale>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Sales
                .Include(s => s.SaleProducts)
                    .ThenInclude(sp => sp.Product)
                .Where(s => s.DeletedDate == null)
                .ToListAsync(cancellationToken);
        }
    }
} 