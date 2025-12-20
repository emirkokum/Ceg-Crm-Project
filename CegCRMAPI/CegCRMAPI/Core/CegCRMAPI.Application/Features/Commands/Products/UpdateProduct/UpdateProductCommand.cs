using AutoMapper;
using CegCRMAPI.Application.DTOs.Product;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Products.UpdateProduct;

public record UpdateProductCommand : IRequest<ApiResponse<ProductDto>>
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public decimal Price { get; init; }
    public int StockQuantity { get; init; }
    public bool IsActive { get; init; }
}

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ApiResponse<ProductDto>>
{
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateProductCommandHandler(
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<ProductDto>> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (product == null)
            {
                return ApiResponse<ProductDto>.CreateError($"Product with ID {request.Id} not found");
            }

            _mapper.Map(request, product);
            await _unitOfWork.SaveChangesAsync();

            var productDto = _mapper.Map<ProductDto>(product);
            return ApiResponse<ProductDto>.CreateSuccess(productDto, "Product updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<ProductDto>.CreateError($"Failed to update product: {ex.Message}");
        }
    }
} 