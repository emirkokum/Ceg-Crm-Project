using AutoMapper;
using CegCRMAPI.Application.DTOs.Customer;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;

namespace CegCRMAPI.Application.Features.Commands.Customers.UpdateCustomer;

public record UpdateCustomerCommand : IRequest<CustomerDto>
{
    public Guid Id { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public CustomerType Type { get; init; }

    public UpdateCustomerCommand(Guid id, UpdateCustomerDto dto)
    {
        Id = id;
        FirstName = dto.FirstName;
        LastName = dto.LastName;
        Email = dto.Email;
        Phone = dto.Phone;
        Address = dto.Address;
        Type = dto.Type;
    }
}

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, CustomerDto>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateCustomerCommandHandler(
        ICustomerRepository customerRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CustomerDto> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(request.Id, cancellationToken);
        if (customer == null)
            throw new KeyNotFoundException($"Customer with ID {request.Id} not found.");

        _mapper.Map(request, customer);
        _customerRepository.Update(customer);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<CustomerDto>(customer);
    }
} 