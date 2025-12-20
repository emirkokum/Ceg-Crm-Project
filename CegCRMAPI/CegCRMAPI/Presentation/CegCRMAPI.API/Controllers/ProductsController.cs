using CegCRMAPI.Application.DTOs.Product;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Features.Commands.Products.CreateProduct;
using CegCRMAPI.Application.Features.Commands.Products.DeleteProduct;
using CegCRMAPI.Application.Features.Commands.Products.UpdateProduct;
using CegCRMAPI.Application.Features.Queries.Products.GetAllProducts;
using CegCRMAPI.Application.Features.Queries.Products.GetProductById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ProductsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAll()
        {
            var query = new GetAllProductsQuery();
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(Guid id)
        {
            var query = new GetProductByIdQuery { Id = id };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ProductDto>>> Create([FromBody] CreateProductCommand command)
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
        public async Task<ActionResult<ApiResponse<ProductDto>>> Update(Guid id, [FromBody] UpdateProductCommand command)
        {
            command = command with { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(Guid id)
        {
            var command = new DeleteProductCommand { Id = id };
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
} 