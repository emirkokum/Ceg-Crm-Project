using AutoMapper;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Application.Repositories;
using MediatR;
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

    public GetAllEmployeesQueryHandler(
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<List<EmployeeDto>> Handle(GetAllEmployeesQuery request, CancellationToken cancellationToken)
    {

        var employees = await _employeeRepository.Query().Include(e => e.User).ToListAsync(cancellationToken);
        return _mapper.Map<List<EmployeeDto>>(employees);
    }
} 