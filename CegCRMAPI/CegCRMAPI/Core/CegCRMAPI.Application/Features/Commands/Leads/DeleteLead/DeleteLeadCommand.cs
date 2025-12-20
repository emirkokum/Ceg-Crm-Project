using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Leads.DeleteLead;

public record DeleteLeadCommand : IRequest<ApiResponse<bool>>
{
    public Guid Id { get; init; }
}

public class DeleteLeadCommandHandler : IRequestHandler<DeleteLeadCommand, ApiResponse<bool>>
{
    private readonly ILeadRepository _leadRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteLeadCommandHandler(
        ILeadRepository leadRepository,
        IUnitOfWork unitOfWork)
    {
        _leadRepository = leadRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteLeadCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var lead = await _leadRepository.GetByIdAsync(request.Id, cancellationToken);
            if (lead == null)
            {
                return ApiResponse<bool>.CreateError($"Lead with ID {request.Id} not found");
            }

            _leadRepository.Remove(lead);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Lead deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.CreateError($"Failed to delete lead: {ex.Message}");
        }
    }
} 