using AutoMapper;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Employees.UpdateEmployee;

public record UpdateEmployeeCommand : IRequest<EmployeeDto>
{
    public Guid Id { get; set; }
    public DateTime HireDate { get; set; }
    public string WorkEmail { get; set; }
    public string WorkPhone { get; set; }
    public int AnnualLeaveDays { get; set; }
    public int UsedLeaveDays { get; set; }
    public decimal PerformanceScore { get; set; }
    public string EmergencyContact { get; set; }
    public string EmergencyPhone { get; set; }
    public string BankAccount { get; set; }
    public decimal Salary { get; set; }
    public string TaxNumber { get; set; }
}

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, EmployeeDto>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<EmployeeDto> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.Id, cancellationToken);
        if (employee == null)
            throw new Exception($"Employee with ID {request.Id} not found");

        _mapper.Map(request, employee);
        _employeeRepository.Update(employee);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<EmployeeDto>(employee);
    }
} 