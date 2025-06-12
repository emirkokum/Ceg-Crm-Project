using CegCRMAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Repositories
{
    public interface IInteractionRepository:IRepository<Interaction>
    {
        Task<List<Interaction>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    }
} 