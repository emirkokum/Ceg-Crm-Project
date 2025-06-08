using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Task.DeleteTask;

public record DeleteTaskCommand : IRequest<ApiResponse<bool>>
{
    public Guid Id { get; init; }
}

public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand, ApiResponse<bool>>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteTaskCommandHandler(
        ITaskRepository taskRepository,
        IUnitOfWork unitOfWork)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ApiResponse<bool>> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return ApiResponse<bool>.CreateError($"Task with ID {request.Id} not found");
            }

            _taskRepository.Remove(task);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<bool>.CreateSuccess(true, "Task deleted successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<bool>.CreateError($"Failed to delete task: {ex.Message}");
        }
    }
} 