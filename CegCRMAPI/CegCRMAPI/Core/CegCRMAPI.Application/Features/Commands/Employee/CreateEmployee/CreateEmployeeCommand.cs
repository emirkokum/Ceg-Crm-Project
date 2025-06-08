using AutoMapper;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Employees.CreateEmployee;

public record CreateEmployeeCommand : IRequest<EmployeeDto>
{
        public Guid UserId { get; set; }
        public string EmployeeNumber { get; set; }
        public DateTime HireDate { get; set; }
        public string WorkEmail { get; set; }
        public string WorkPhone { get; set; }
        public int AnnualLeaveDays { get; set; }
        public int UsedLeaveDays { get; set; }
        public decimal PerformanceScore { get; set; }
        public string EmergencyContact { get; set; }
        public string EmergencyPhone { get; set; }
        public string BankAccount { get; set; }
        public string TaxNumber { get; set; }
}

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, EmployeeDto>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<EmployeeDto> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = _mapper.Map<Domain.Entities.Employee>(request);

        await _employeeRepository.AddAsync(employee, cancellationToken);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<EmployeeDto>(employee);
    }
}