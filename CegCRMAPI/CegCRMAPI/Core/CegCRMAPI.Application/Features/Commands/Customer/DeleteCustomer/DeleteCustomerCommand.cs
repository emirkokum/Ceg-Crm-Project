using CegCRMAPI.Application.Repositories;
using MediatR;
using System;

namespace CegCRMAPI.Application.Features.Commands.Customer.DeleteCustomer;

public record DeleteCustomerCommand : IRequest<bool>
{
    public Guid Id { get; init; }
}

public class DeleteCustomerCommandHandler : IRequestHandler<DeleteCustomerCommand, bool>
{
    private readonly ICustomerRepository _customerRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCustomerCommandHandler(
        ICustomerRepository customerRepository,
        IUnitOfWork unitOfWork)
    {
        _customerRepository = customerRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(request.Id, cancellationToken);
        
        if (customer == null)
            throw new KeyNotFoundException($"Customer with ID {request.Id} not found.");

        _customerRepository.Remove(customer);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
} 