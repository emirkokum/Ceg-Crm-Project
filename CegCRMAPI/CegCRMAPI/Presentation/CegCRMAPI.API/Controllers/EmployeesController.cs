using CegCRMAPI.Application.DTOs.Employee;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Employees.CreateEmployee;
using CegCRMAPI.Application.Features.Commands.Employees.UpdateEmployee;
using CegCRMAPI.Application.Features.Queries.Employees.GetAllEmployees;
using CegCRMAPI.Application.Features.Queries.Employees.GetEmployeeById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CegCRMAPI.Application.Features.Commands.Employee.DeleteEmployee;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public EmployeesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<EmployeeDto>>>> GetAll()
        {
            var query = new GetAllEmployeesQuery();
            var result = await _mediator.Send(query);
            return Ok(ApiResponse<List<EmployeeDto>>.CreateSuccess(result, "Employees retrieved successfully"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<EmployeeDto>>> GetById(Guid id)
        {
            var query = new GetEmployeeByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(ApiResponse<EmployeeDto>.CreateSuccess(result, "Employee retrieved successfully"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<EmployeeDto>>> Create([FromBody] CreateEmployeeCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = result.Id }, 
                ApiResponse<EmployeeDto>.CreateSuccess(result, "Employee created successfully")
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<EmployeeDto>>> Update(Guid id, [FromBody] UpdateEmployeeCommand command)
        {
            command.Id = id;
            var result = await _mediator.Send(command);
            return Ok(ApiResponse<EmployeeDto>.CreateSuccess(result, "Employee updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteEmployeeCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(ApiResponse<bool>.CreateSuccess(result, "Employee deleted successfully"));
        }
    }
}