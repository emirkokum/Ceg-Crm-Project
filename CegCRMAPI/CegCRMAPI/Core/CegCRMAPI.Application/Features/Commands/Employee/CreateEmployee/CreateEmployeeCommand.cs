using AutoMapper;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using CegCRMAPI.Application.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Application.Features.Commands.Employees.CreateEmployee;

public record CreateEmployeeCommand : IRequest<EmployeeDto>
{
        public Guid UserId { get; set; }
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

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, EmployeeDto>
{
    private readonly UserManager<Domain.Entities.User> _userManager;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateEmployeeCommandHandler(
        IEmployeeRepository employeeRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper,
        UserManager<Domain.Entities.User> userManager)
    {
        _employeeRepository = employeeRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<EmployeeDto> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _userManager.Users
                .Where(u => u.Id == request.UserId && u.DeletedDate == null)
                .FirstOrDefaultAsync(cancellationToken);

            if (user == null)
                throw new Exception("Cannot create employee for a deleted or non-existent user.");

            var employee = _mapper.Map<Domain.Entities.Employee>(request);

            employee.EmployeeNumber = $"EMP-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

            await _employeeRepository.AddAsync(employee, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("EMPLOYEE"))
            {
                await _userManager.RemoveFromRolesAsync(user, roles);
                await _userManager.AddToRoleAsync(user, "EMPLOYEE");
            }

            return _mapper.Map<EmployeeDto>(employee);
        }
        catch (Exception ex)
        {
            throw new Exception("Employee creation failed", ex);
        }
    }
}
