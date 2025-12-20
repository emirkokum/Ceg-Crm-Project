using AutoMapper;
using CegCRMAPI.Application.DTOs.Product;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Products.CreateProduct;

public record CreateProductCommand : IRequest<ApiResponse<ProductDto>>
{
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
    public bool IsActive { get; init; } = true;
}

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ApiResponse<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var product = _mapper.Map<Product>(request);

            await _productRepository.AddAsync(product, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var productDto = _mapper.Map<ProductDto>(product);
            return ApiResponse<ProductDto>.CreateSuccess(productDto, "Product created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProductDto>.CreateError($"Failed to create product: {ex.Message}");
        }
    }
} 