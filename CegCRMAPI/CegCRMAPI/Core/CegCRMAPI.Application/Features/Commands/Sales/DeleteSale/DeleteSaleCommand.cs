using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Sales.DeleteSale;

public record DeleteSaleCommand : IRequest<ApiResponse<bool>>
{
    public Guid Id { get; init; }
}

public class DeleteSaleCommandHandler : IRequestHandler<DeleteSaleCommand, ApiResponse<bool>>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSaleCommandHandler(
        ISaleRepository saleRepository,
        IUnitOfWork unitOfWork)
    {
        _saleRepository = saleRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteSaleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var sale = await _saleRepository.GetByIdAsync(request.Id, cancellationToken);
            if (sale == null)
            {
                return ApiResponse<bool>.CreateError($"Sale with ID {request.Id} not found");
            }

            _saleRepository.Remove(sale);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Sale deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.CreateError($"Failed to delete sale: {ex.Message}");
        }
    }
} 