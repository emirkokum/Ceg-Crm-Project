using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Application.Repositories
{
    public interface ITicketRepository : IRepository<Ticket>
    {
        Task<List<Ticket>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    }
} 