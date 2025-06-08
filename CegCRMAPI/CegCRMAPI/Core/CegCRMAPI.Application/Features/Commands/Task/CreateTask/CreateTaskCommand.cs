using AutoMapper;
using CegCRMAPI.Application.DTOs.Task;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Application.Repositories;
using MediatR;

namespace CegCRMAPI.Application.Features.Commands.Tasks.CreateTask;

public record CreateTaskCommand : IRequest<ApiResponse<TaskDto>>
{
    public Guid AssignedUserId { get; init; }
    public Guid? CustomerId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public DateTime DueDate { get; init; }
    public string Priority { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
}

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, ApiResponse<TaskDto>>
{
    private readonly ITaskRepository _taskRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateTaskCommandHandler(
        ITaskRepository taskRepository,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _taskRepository = taskRepository;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<TaskDto>> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var task = _mapper.Map<TaskItem>(request);

            await _taskRepository.AddAsync(task, cancellationToken);
            await _unitOfWork.SaveChangesAsync();

            var taskDto = _mapper.Map<TaskDto>(task);
            return ApiResponse<TaskDto>.CreateSuccess(taskDto, "Task created successfully");
        }
        catch (Exception ex)
        {
            return ApiResponse<TaskDto>.CreateError($"Failed to create task: {ex.Message}");
        }
    }
} 