using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using CegCRMAPI.Persistence.Context;
using CegCRMAPI.Persistence.Repositories;

namespace CegCRMAPI.Persistence.Repositories
{
    public class LeadRepository : Repository<Lead>, ILeadRepository
    {
        public LeadRepository(CegCrmDbContext context) : base(context)
        {
        }
    }
} 