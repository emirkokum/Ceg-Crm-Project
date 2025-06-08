using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Products.DeleteProduct;

public record DeleteProductCommand : IRequest<ApiResponse<bool>>
{
    public Guid Id { get; init; }
}

public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, ApiResponse<bool>>
{
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProductCommandHandler(
        IProductRepository productRepository,
        IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var product = await _productRepository.GetByIdAsync(request.Id, cancellationToken);
            if (product == null)
            {
                return ApiResponse<bool>.CreateError($"Product with ID {request.Id} not found");
            }

            _productRepository.Remove(product);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Product deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.CreateError($"Failed to delete product: {ex.Message}");
        }
    }
} 