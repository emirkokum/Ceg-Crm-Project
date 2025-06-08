using AutoMapper;
using CegCRMAPI.Application.DTOs.Sale;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Sales.GetAllSales;

public record GetAllSalesQuery : IRequest<ApiResponse<List<SaleDto>>>
{
}

public class GetAllSalesQueryHandler : IRequestHandler<GetAllSalesQuery, ApiResponse<List<SaleDto>>>
{
    private readonly ISaleRepository _saleRepository;
    private readonly IMapper _mapper;

    public GetAllSalesQueryHandler(
        ISaleRepository saleRepository,
        IMapper mapper)
    {
        _saleRepository = saleRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<SaleDto>>> Handle(GetAllSalesQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var sales = await _saleRepository.GetAllAsync(cancellationToken);
            var saleDtos = _mapper.Map<List<SaleDto>>(sales);
            
            return ApiResponse<List<SaleDto>>.CreateSuccess(
                saleDtos, 
                "Sales retrieved successfully"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<List<SaleDto>>.CreateError($"Failed to retrieve sales: {ex.Message}");
        }
    }
} 