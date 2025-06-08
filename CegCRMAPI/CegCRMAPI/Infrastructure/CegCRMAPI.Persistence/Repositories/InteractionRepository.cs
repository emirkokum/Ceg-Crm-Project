using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CegCRMAPI.Persistence.Repositories;

namespace CegCRMAPI.Infrastructure.Repositories
{
    public class InteractionRepository : Repository<Interaction>, IInteractionRepository
    {
        public InteractionRepository(CegCrmDbContext context) : base(context)
        {
        }
    }
} 