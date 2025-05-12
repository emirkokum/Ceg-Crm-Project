using CegCRMAPI.Domain.Entities;
using CegCRMAPI.Domain.Repositories;
using CegCRMAPI.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace CegCRMAPI.Persistence.Repositories
{
    public class TaskRepository : Repository<TaskItem>, ITaskRepository
    {
        public TaskRepository(CegCrmDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByAssignedUserAsync(Guid userId)
        {
            return await _context.Tasks
                .Where(t => t.AssignedUserId == userId)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(string status)
        {
            return await _context.Tasks
                .Where(t => t.Status == status)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByPriorityAsync(string priority)
        {
            return await _context.Tasks
                .Where(t => t.Priority == priority)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetTasksByDueDateAsync(DateTime dueDate)
        {
            return await _context.Tasks
                .Where(t => t.DueDate.Date == dueDate.Date)
                .ToListAsync();
        }

        public async Task<IEnumerable<TaskItem>> GetOverdueTasksAsync()
        {
            return await _context.Tasks
                .Where(t => t.DueDate < DateTime.UtcNow && t.Status != "Completed")
                .ToListAsync();
        }
    }
} 