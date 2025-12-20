using AutoMapper;
using CegCRMAPI.Application.DTOs.Product;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Products.GetProductById;

public record GetProductByIdQuery : IRequest<ApiResponse<ProductDto>>
{
    public Guid Id { get; init; }
}

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ApiResponse<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public GetProductByIdQueryHandler(
        IProductRepository productRepository,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ProductDto>> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (product == null)
            {
                return ApiResponse<ProductDto>.CreateError($"Product with ID {request.Id} not found");
            }

            var productDto = _mapper.Map<ProductDto>(product);
            return ApiResponse<ProductDto>.CreateSuccess(productDto, "Product retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProductDto>.CreateError($"Failed to retrieve product: {ex.Message}");
        }
    }
} 