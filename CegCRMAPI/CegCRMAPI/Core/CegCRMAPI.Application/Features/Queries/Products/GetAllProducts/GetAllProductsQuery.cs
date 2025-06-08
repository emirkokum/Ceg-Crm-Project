using AutoMapper;
using CegCRMAPI.Application.DTOs.Product;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Products.GetAllProducts;

public record GetAllProductsQuery : IRequest<ApiResponse<List<ProductDto>>>
{
}

public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, ApiResponse<List<ProductDto>>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public GetAllProductsQueryHandler(
        IProductRepository productRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<ProductDto>>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var products = await _productRepository.GetAllAsync(cancellationToken);
            var productDtos = _mapper.Map<List<ProductDto>>(products);
            
            return ApiResponse<List<ProductDto>>.CreateSuccess(
                productDtos, 
                "Products retrieved successfully"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<List<ProductDto>>.CreateError($"Failed to retrieve products: {ex.Message}");
        }
    }
} 