using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Domain.Repositories
{
    public interface ILeadRepository : IRepository<Lead>
    {
        Task<IEnumerable<Lead>> GetLeadsByStatusAsync(string status);
        Task<IEnumerable<Lead>> GetLeadsBySourceAsync(string source);
        Task<IEnumerable<Lead>> GetLeadsWithInteractionsAsync();
    }
} 