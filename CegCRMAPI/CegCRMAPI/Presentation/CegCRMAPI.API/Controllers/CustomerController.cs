using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.DTOs.Customer;
using CegCRMAPI.Application.Features.Commands.Customer.DeleteCustomer;
using CegCRMAPI.Application.Features.Commands.Customers.CreateCustomer;
using CegCRMAPI.Application.Features.Commands.Customers.UpdateCustomer;
using CegCRMAPI.Application.Features.Queries.Customers.GetAllCustomers;
using CegCRMAPI.Application.Features.Queries.Customers.GetCustomerById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CustomerController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CustomerDto>>>> GetAll()
        {
            var query = new GetAllCustomersQuery();
            var result = await _mediator.Send(query);
            return Ok(ApiResponse<List<CustomerDto>>.CreateSuccess(result.ToList(), "Customers retrieved successfully"));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> GetById(Guid id)
        {
            var query = new GetCustomerByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(ApiResponse<CustomerDto>.CreateSuccess(result, "Customer retrieved successfully"));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> Create([FromBody] CreateCustomerCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(
                nameof(GetById), 
                new { id = result.Id }, 
                ApiResponse<CustomerDto>.CreateSuccess(result, "Customer created successfully")
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<CustomerDto>>> Update(Guid id, [FromBody] UpdateCustomerDto dto)
        {
            var command = new UpdateCustomerCommand(id, dto);
            var result = await _mediator.Send(command);
            return Ok(ApiResponse<CustomerDto>.CreateSuccess(result, "Customer updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteCustomerCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(ApiResponse<bool>.CreateSuccess(result, "Customer deleted successfully"));
        }
    }
} 