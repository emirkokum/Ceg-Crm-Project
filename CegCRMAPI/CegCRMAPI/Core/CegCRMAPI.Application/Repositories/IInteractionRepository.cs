using CegCRMAPI.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Repositories
{
    public interface IInteractionRepository
    {
        Task<Interaction> GetByIdAsync(Guid id);
        Task<IEnumerable<Interaction>> GetAllInteractionsAsync();
        Task<IEnumerable<Interaction>> GetInteractionsByCustomerIdAsync(Guid customerId);
        Task<Interaction> CreateAsync(Interaction interaction);
        Task<Interaction> UpdateAsync(Interaction interaction);
        Task<bool> DeleteAsync(Guid id);
    }
} 