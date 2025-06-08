using AutoMapper;
using CegCRMAPI.Application.DTOs.Interaction;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Interactions.UpdateInteraction;

public record UpdateInteractionCommand : IRequest<ApiResponse<InteractionDto>>
{
    public Guid Id { get; init; }
    public Guid CustomerId { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public DateTime InteractionDate { get; init; }
}

public class UpdateInteractionCommandHandler : IRequestHandler<UpdateInteractionCommand, ApiResponse<InteractionDto>>
{
    private readonly IInteractionRepository _interactionRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateInteractionCommandHandler(
        IInteractionRepository interactionRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _interactionRepository = interactionRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<InteractionDto>> Handle(UpdateInteractionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var interaction = await _interactionRepository.GetByIdAsync(request.Id, cancellationToken);
            if (interaction == null)
            {
                return ApiResponse<InteractionDto>.CreateError($"Interaction with ID {request.Id} not found");
            }

            _mapper.Map(request, interaction);
            await _unitOfWork.SaveChangesAsync();

            var interactionDto = _mapper.Map<InteractionDto>(interaction);
            return ApiResponse<InteractionDto>.CreateSuccess(interactionDto, "Interaction updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<InteractionDto>.CreateError($"Failed to update interaction: {ex.Message}");
        }
    }
} 