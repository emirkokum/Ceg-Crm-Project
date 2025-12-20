using AutoMapper;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Interactions.CreateInteraction;

public record CreateInteractionCommand : IRequest<ApiResponse<InteractionDto>>
{
    public Guid CustomerId { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public DateTime InteractionDate { get; init; }
}

public class CreateInteractionCommandHandler : IRequestHandler<CreateInteractionCommand, ApiResponse<InteractionDto>>
{
    private readonly IInteractionRepository _interactionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateInteractionCommandHandler(
        IInteractionRepository interactionRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _interactionRepository = interactionRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<InteractionDto>> Handle(CreateInteractionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var interaction = _mapper.Map<Interaction>(request);

            await _interactionRepository.AddAsync(interaction, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var interactionDto = _mapper.Map<InteractionDto>(interaction);
            return ApiResponse<InteractionDto>.CreateSuccess(interactionDto, "Interaction created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<InteractionDto>.CreateError($"Failed to create interaction: {ex.Message}");
        }
    }
} 