using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;

namespace CegCRMAPI.Infrastructure.Repositories 
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(CegCrmDbContext context) : base(context)
        {
        }
    }
} 