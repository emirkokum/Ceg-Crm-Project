using AutoMapper;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Queries.Interactions.GetInteractionById;

public record GetInteractionByIdQuery : IRequest<ApiResponse<InteractionDto>>
{
    public Guid Id { get; init; }
}

public class GetInteractionByIdQueryHandler : IRequestHandler<GetInteractionByIdQuery, ApiResponse<InteractionDto>>
{
    private readonly IInteractionRepository _interactionRepository;
    private readonly IMapper _mapper;

    public GetInteractionByIdQueryHandler(
        IInteractionRepository interactionRepository,
        IMapper mapper)
    {
        _interactionRepository = interactionRepository;
        _mapper = mapper;
    }

    public async Task<ApiResponse<InteractionDto>> Handle(GetInteractionByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var interaction = await _interactionRepository.GetByIdAsync(request.Id, cancellationToken);
            if (interaction == null)
            {
                return ApiResponse<InteractionDto>.CreateError($"Interaction with ID {request.Id} not found");
            }

            var interactionDto = _mapper.Map<InteractionDto>(interaction);
            return ApiResponse<InteractionDto>.CreateSuccess(interactionDto, "Interaction retrieved successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<InteractionDto>.CreateError($"Failed to retrieve interaction: {ex.Message}");
        }
    }
} 