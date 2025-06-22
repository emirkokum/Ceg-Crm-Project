using AutoMapper;
using CegCRMAPI.Application.DTOs.Sale;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using static CegCRMAPI.Domain.Entities.Sale;

namespace CegCRMAPI.Application.Features.Commands.Sales.CreateSale;

public record CreateSaleCommand : IRequest<ApiResponse<SaleDto>>
{
    public DateTime SaleDate { get; init; }
    public Guid CustomerId { get; init; }
    public Guid SalesPersonId { get; init; }
    public decimal TotalAmount { get; init; }
    public decimal Discount { get; init; }
    public decimal Tax { get; init; }
    public decimal FinalAmount { get; init; }
    public SaleStatus Status { get; init; }
    public string? InvoiceNumber { get; init; } = string.Empty;
    public ICollection<SaleProductItemDto> Products { get; init; } = new List<SaleProductItemDto>();
}

public class CreateSaleCommandHandler : IRequestHandler<CreateSaleCommand, ApiResponse<SaleDto>>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateSaleCommandHandler(
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

    public async Task<ApiResponse<SaleDto>> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var sale = new Sale
            {
                SaleDate = request.SaleDate,
                CustomerId = request.CustomerId,
                SalesPersonId = request.SalesPersonId,
                TotalAmount = request.TotalAmount,
                Discount = request.Discount,
                Tax = request.Tax,
                FinalAmount = request.FinalAmount,
                Status = request.Status,
                InvoiceNumber = string.IsNullOrWhiteSpace(request.InvoiceNumber)
                    ? $"INV-{DateTime.UtcNow:yyyyMMddHHmmssfff}"
                    : request.InvoiceNumber
            };


            foreach (var productItem in request.Products)
            {
                var product = await _productRepository.GetByIdAsync(productItem.ProductId, cancellationToken);
                if (product != null)
                {
                    var saleProduct = new SaleProduct
                    {
                        ProductId = product.Id,
                        Quantity = productItem.Quantity,
                        UnitPrice = productItem.UnitPrice,
                        TotalPrice = productItem.Quantity * productItem.UnitPrice
                    };
                    sale.SaleProducts.Add(saleProduct);
                }
            }

            await _saleRepository.AddAsync(sale, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var saleDto = _mapper.Map<SaleDto>(sale);
            return ApiResponse<SaleDto>.CreateSuccess(saleDto, "Sale created successfully");
        }
        catch (Exception ex)
        {
            var errorMessage = ex.InnerException != null
                ? $"{ex.Message} - Inner: {ex.InnerException.Message}"
                : ex.Message;

            return ApiResponse<SaleDto>.CreateError($"Failed to create sale: {errorMessage}");

        }
    }
}