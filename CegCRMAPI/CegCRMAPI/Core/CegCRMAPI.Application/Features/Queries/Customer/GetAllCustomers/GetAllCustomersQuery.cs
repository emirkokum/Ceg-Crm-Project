using AutoMapper;
using CegCRMAPI.Application.DTOs.Customer;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Customers.GetAllCustomers;

public record GetAllCustomersQuery : IRequest<IEnumerable<CustomerDto>>
{
}

public class GetAllCustomersQueryHandler : IRequestHandler<GetAllCustomersQuery, IEnumerable<CustomerDto>>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public GetAllCustomersQueryHandler(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CustomerDto>> Handle(GetAllCustomersQuery request, CancellationToken cancellationToken)
    {
        var customers = await _customerRepository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<CustomerDto>>(customers);
    }
} 