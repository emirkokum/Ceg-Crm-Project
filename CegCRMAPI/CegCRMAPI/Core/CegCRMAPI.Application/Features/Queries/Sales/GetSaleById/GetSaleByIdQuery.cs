using AutoMapper;
using CegCRMAPI.Application.DTOs.Sale;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Sales.GetSaleById;

public record GetSaleByIdQuery : IRequest<ApiResponse<SaleDto>>
{
    public Guid Id { get; init; }
}

public class GetSaleByIdQueryHandler : IRequestHandler<GetSaleByIdQuery, ApiResponse<SaleDto>>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IMapper _mapper;

    public GetSaleByIdQueryHandler(
        ISaleRepository saleRepository,
        IMapper mapper)
    {
        _saleRepository = saleRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<SaleDto>> Handle(GetSaleByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var sale = await _saleRepository.GetByIdAsync(request.Id, cancellationToken);
            if (sale == null)
            {
                return ApiResponse<SaleDto>.CreateError($"Sale with ID {request.Id} not found");
            }

            var saleDto = _mapper.Map<SaleDto>(sale);
            return ApiResponse<SaleDto>.CreateSuccess(saleDto, "Sale retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<SaleDto>.CreateError($"Failed to retrieve sale: {ex.Message}");
        }
    }
} 