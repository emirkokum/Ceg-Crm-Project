using AutoMapper;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Leads.GetAllLeads;

public record GetAllLeadsQuery : IRequest<ApiResponse<List<LeadDto>>>
{
}

public class GetAllLeadsQueryHandler : IRequestHandler<GetAllLeadsQuery, ApiResponse<List<LeadDto>>>
{
    private readonly ILeadRepository _leadRepository;
    private readonly IMapper _mapper;

    public GetAllLeadsQueryHandler(
        ILeadRepository leadRepository,
        IMapper mapper)
    {
        _leadRepository = leadRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<LeadDto>>> Handle(GetAllLeadsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var leads = await _leadRepository.GetAllAsync(cancellationToken);
            var leadDtos = _mapper.Map<List<LeadDto>>(leads);
            
            return ApiResponse<List<LeadDto>>.CreateSuccess(
                leadDtos, 
                "Leads retrieved successfully"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<List<LeadDto>>.CreateError($"Failed to retrieve leads: {ex.Message}");
        }
    }
} 