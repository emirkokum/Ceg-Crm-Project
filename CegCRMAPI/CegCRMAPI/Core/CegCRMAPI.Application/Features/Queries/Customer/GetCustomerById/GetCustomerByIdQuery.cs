using AutoMapper;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using CegCRMAPI.Application.DTOs.Customer;

namespace CegCRMAPI.Application.Features.Queries.Customers.GetCustomerById;

public record GetCustomerByIdQuery : IRequest<CustomerDto>
{
    public Guid Id { get; init; }
}

public class GetCustomerByIdQueryHandler : IRequestHandler<GetCustomerByIdQuery, CustomerDto>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IMapper _mapper;

    public GetCustomerByIdQueryHandler(ICustomerRepository customerRepository, IMapper mapper)
    {
        _customerRepository = customerRepository;
        _mapper = mapper;
    }

    public async Task<CustomerDto> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(request.Id, cancellationToken);
        return _mapper.Map<CustomerDto>(customer);
    }
}