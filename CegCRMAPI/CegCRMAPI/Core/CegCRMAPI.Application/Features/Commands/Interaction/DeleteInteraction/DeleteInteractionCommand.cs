using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Interactions.DeleteInteraction;

public record DeleteInteractionCommand : IRequest<ApiResponse<bool>>
{
    public Guid Id { get; init; }
}

public class DeleteInteractionCommandHandler : IRequestHandler<DeleteInteractionCommand, ApiResponse<bool>>
{
    private readonly IInteractionRepository _interactionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteInteractionCommandHandler(
        IInteractionRepository interactionRepository,
        IUnitOfWork unitOfWork)
    {
        _interactionRepository = interactionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteInteractionCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var interaction = await _interactionRepository.GetByIdAsync(request.Id, cancellationToken);
            if (interaction == null)
            {
                return ApiResponse<bool>.CreateError($"Interaction with ID {request.Id} not found");
            }

            _interactionRepository.Remove(interaction);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Interaction deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.CreateError($"Failed to delete interaction: {ex.Message}");
        }
    }
} 