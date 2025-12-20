using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
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