using AutoMapper;
using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Tasks.UpdateTask;

public record UpdateTaskCommand : IRequest<ApiResponse<TaskDto>>
{
    public Guid Id { get; init; }
    public Guid AssignedEmployeeId { get; init; }
    public Guid? CustomerId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime DueDate { get; init; }
    public TaskPriority Priority { get; init; }
    public Domain.Entities.TaskStatus Status { get; init; }
    public TaskType Type { get; init; }
}

public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand, ApiResponse<TaskDto>>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateTaskCommandHandler(
        ITaskRepository taskRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TaskDto>> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var task = await _taskRepository.GetByIdAsync(request.Id, cancellationToken);
            if (task == null)
            {
                return ApiResponse<TaskDto>.CreateError($"Task with ID {request.Id} not found");
            }

            _mapper.Map(request, task);
            await _unitOfWork.SaveChangesAsync();

            var taskDto = _mapper.Map<TaskDto>(task);
            return ApiResponse<TaskDto>.CreateSuccess(taskDto, "Task updated successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TaskDto>.CreateError($"Failed to update task: {ex.Message}");
        }
    }
} 