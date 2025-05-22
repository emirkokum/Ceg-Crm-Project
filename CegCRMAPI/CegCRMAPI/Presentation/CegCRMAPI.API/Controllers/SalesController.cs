using CegCRMAPI.Application.DTOs.Sale;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Sales.CreateSale;
using CegCRMAPI.Application.Features.Commands.Sales.DeleteSale;
using CegCRMAPI.Application.Features.Commands.Sales.UpdateSale;
using CegCRMAPI.Application.Features.Queries.Sales.GetAllSales;
using CegCRMAPI.Application.Features.Queries.Sales.GetSaleById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SalesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<SaleDto>>>> GetAll()
        {
            var query = new GetAllSalesQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<SaleDto>>> GetById(Guid id)
        {
            var query = new GetSaleByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<SaleDto>>> Create([FromBody] CreateSaleCommand command)
        {
            var result = await _mediator.Send(command);
            
            if (!result.Success)
            {
                return BadRequest(result);
            }

            return CreatedAtAction(
                nameof(GetById), 
                new { id = result.Data.Id }, 
                result
            );
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<SaleDto>>> Update(Guid id, [FromBody] UpdateSaleCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteSaleCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
} 