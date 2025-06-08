using AutoMapper;
using CegCRMAPI.Application.DTOs.Lead;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Leads.GetLeadById;

public record GetLeadByIdQuery : IRequest<ApiResponse<LeadDto>>
{
    public Guid Id { get; init; }
}

public class GetLeadByIdQueryHandler : IRequestHandler<GetLeadByIdQuery, ApiResponse<LeadDto>>
{
    private readonly ILeadRepository _leadRepository;
    private readonly IMapper _mapper;

    public GetLeadByIdQueryHandler(
        ILeadRepository leadRepository,
        IMapper mapper)
    {
        _leadRepository = leadRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<LeadDto>> Handle(GetLeadByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var lead = await _leadRepository.GetByIdAsync(request.Id, cancellationToken);
            if (lead == null)
            {
                return ApiResponse<LeadDto>.CreateError($"Lead with ID {request.Id} not found");
            }

            var leadDto = _mapper.Map<LeadDto>(lead);
            return ApiResponse<LeadDto>.CreateSuccess(leadDto, "Lead retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<LeadDto>.CreateError($"Failed to retrieve lead: {ex.Message}");
        }
    }
} 