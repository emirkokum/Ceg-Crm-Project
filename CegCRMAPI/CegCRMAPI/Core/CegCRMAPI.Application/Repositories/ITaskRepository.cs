using CegCRMAPI.Domain.Entities;

namespace CegCRMAPI.Domain.Repositories
{
    public interface ITaskRepository : IRepository<TaskItem>
    {
        Task<IEnumerable<TaskItem>> GetTasksByAssignedUserAsync(Guid userId);
        Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(string status);
        Task<IEnumerable<TaskItem>> GetTasksByPriorityAsync(string priority);
        Task<IEnumerable<TaskItem>> GetTasksByDueDateAsync(DateTime dueDate);
        Task<IEnumerable<TaskItem>> GetOverdueTasksAsync();
    }
} 