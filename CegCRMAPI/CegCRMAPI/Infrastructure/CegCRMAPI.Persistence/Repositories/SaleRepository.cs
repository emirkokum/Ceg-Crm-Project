using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;

namespace CegCRMAPI.Infrastructure.Repositories 
{
    public class SaleRepository : Repository<Sale>, ISaleRepository
    {
        public SaleRepository(CegCrmDbContext context) : base(context)
        {
        }
    }
} 