using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Domain.Repositories
{
    public interface ICustomerRepository : IRepository<Customer>
    {
        Task<IEnumerable<Customer>> GetCustomersBySegmentAsync(string segment);
        Task<IEnumerable<Customer>> GetCustomersWithInteractionsAsync();
    }
} 