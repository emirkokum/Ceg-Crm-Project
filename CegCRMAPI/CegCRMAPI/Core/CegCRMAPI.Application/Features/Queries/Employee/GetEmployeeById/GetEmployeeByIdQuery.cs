using AutoMapper;
using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Employees.GetEmployeeById;

public record GetEmployeeByIdQuery : IRequest<EmployeeDto>
{
    public Guid Id { get; set; }
}

public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto>
{
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IMapper _mapper;

    public GetEmployeeByIdQueryHandler(
        IEmployeeRepository employeeRepository,
        IMapper mapper)
    {
        _employeeRepository = employeeRepository;
        _mapper = mapper;
    }

    public async Task<EmployeeDto> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.Id, cancellationToken);
        if (employee == null)
            throw new Exception($"Employee with ID {request.Id} not found");

        return _mapper.Map<EmployeeDto>(employee);
    }
} 