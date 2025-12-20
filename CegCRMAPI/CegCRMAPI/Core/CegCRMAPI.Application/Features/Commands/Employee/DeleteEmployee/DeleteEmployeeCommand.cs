using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Employee.DeleteEmployee;

public record DeleteEmployeeCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, bool>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.Id, cancellationToken);
        if (employee == null)
            throw new Exception($"Employee with ID {request.Id} not found");

        _employeeRepository.Remove(employee);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
} 