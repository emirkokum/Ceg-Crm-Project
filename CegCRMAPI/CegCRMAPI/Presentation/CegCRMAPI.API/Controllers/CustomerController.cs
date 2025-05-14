using CegCRMAPI.Application.Features.Commands.Customers.CreateCustomer;
using CegCRMAPI.Application.Features.Queries.Customers.GetCustomerById;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CegCRMAPI.Application.DTOs.Customer;

namespace CegCRMAPI.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public CustomersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost]
        public async Task<ActionResult<Customer>> Create(CreateCustomerCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> GetById(Guid id)
        {
            var query = new GetCustomerByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
} 