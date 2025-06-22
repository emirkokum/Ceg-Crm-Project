using AutoMapper;
using CegCRMAPI.Application.DTOs.Sale;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using static CegCRMAPI.Domain.Entities.Sale;

namespace CegCRMAPI.Application.Features.Commands.Sales.UpdateSale;

public record UpdateSaleCommand : IRequest<ApiResponse<SaleDto>>
{
    public Guid Id { get; init; }
    public DateTime SaleDate { get; init; }
    public Guid CustomerId { get; init; }
    public Guid SalesPersonId { get; init; }
    public decimal TotalAmount { get; init; }
    public decimal Discount { get; init; }
    public decimal Tax { get; init; }
    public decimal FinalAmount { get; init; }
    public SaleStatus Status { get; init; }
    public string InvoiceNumber { get; init; } = string.Empty;
    public ICollection<SaleProductItemDto> Products { get; init; } = new List<SaleProductItemDto>();
}

public class UpdateSaleCommandHandler : IRequestHandler<UpdateSaleCommand, ApiResponse<SaleDto>>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateSaleCommandHandler(
        ISaleRepository saleRepository,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _saleRepository = saleRepository;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<SaleDto>> Handle(UpdateSaleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var sale = await _saleRepository.GetByIdAsync(request.Id, cancellationToken);
            if (sale == null)
            {
                return ApiResponse<SaleDto>.CreateError($"Sale with ID {request.Id} not found");
            }

            _mapper.Map(request, sale);

            // Clear existing products and add new ones
            sale.SaleProducts.Clear();
            foreach (var productItem in request.Products)
            {
                var product = await _productRepository.GetByIdAsync(productItem.ProductId, cancellationToken);
                if (product != null)
                {
                    var saleProduct = new SaleProduct
                    {
                        SaleId = sale.Id,
                        ProductId = product.Id,
                        Quantity = productItem.Quantity,
                        UnitPrice = productItem.UnitPrice,
                        TotalPrice = productItem.Quantity * productItem.UnitPrice
                    };
                    sale.SaleProducts.Add(saleProduct);
                }
            }

            await _unitOfWork.SaveChangesAsync();

            var saleDto = _mapper.Map<SaleDto>(sale);
            return ApiResponse<SaleDto>.CreateSuccess(saleDto, "Sale updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<SaleDto>.CreateError($"Failed to update sale: {ex.Message}");
        }
    }
} 