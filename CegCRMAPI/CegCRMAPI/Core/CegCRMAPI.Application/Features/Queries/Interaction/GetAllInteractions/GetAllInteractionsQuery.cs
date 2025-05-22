using AutoMapper;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Repositories;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Interactions.GetAllInteractions;

public record GetAllInteractionsQuery : IRequest<ApiResponse<List<InteractionDto>>>
{
}

public class GetAllInteractionsQueryHandler : IRequestHandler<GetAllInteractionsQuery, ApiResponse<List<InteractionDto>>>
{
    private readonly IInteractionRepository _interactionRepository;
    private readonly IMapper _mapper;

    public GetAllInteractionsQueryHandler(
        IInteractionRepository interactionRepository,
        IMapper mapper)
    {
        _interactionRepository = interactionRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<InteractionDto>>> Handle(GetAllInteractionsQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var interactions = await _interactionRepository.GetAllAsync(cancellationToken);
            var interactionDtos = _mapper.Map<List<InteractionDto>>(interactions);
            
            return ApiResponse<List<InteractionDto>>.CreateSuccess(
                interactionDtos, 
                "Interactions retrieved successfully"
            );
        }
        catch (Exception ex)
        {
            return ApiResponse<List<InteractionDto>>.CreateError($"Failed to retrieve interactions: {ex.Message}");
        }
    }
} 