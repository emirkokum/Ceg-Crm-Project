using AutoMapper;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Application.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Employees.GetAllEmployees;

public record GetAllEmployeesQuery : IRequest<List<EmployeeDto>>
{
}

public class GetAllEmployeesQueryHandler : IRequestHandler<GetAllEmployeesQuery, List<EmployeeDto>>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;
    private readonly UserManager<Domain.Entities.User> _userManager;

    public GetAllEmployeesQueryHandler(
        IEmployeeRepository employeeRepository,
        IMapper mapper,
        UserManager<Domain.Entities.User> userManager)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<List<EmployeeDto>> Handle(GetAllEmployeesQuery request, CancellationToken cancellationToken)
    {
        var employees = await _employeeRepository
            .Query()
            .Include(e => e.User)
            .ToListAsync(cancellationToken);

        var result = new List<EmployeeDto>();

        foreach (var employee in employees)
        {
            var employeeDto = _mapper.Map<EmployeeDto>(employee);

            if (employee.User != null)
            {
                var roles = await _userManager.GetRolesAsync(employee.User);
                employeeDto.User.Role = roles.FirstOrDefault();
            }

            result.Add(employeeDto);
        }

        return result;
    }
}