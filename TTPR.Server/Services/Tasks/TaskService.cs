using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TTPR.Server.Data;
using TTPR.Server.Entities;
using TTPR.Server.Models.Tasks.Requests;
using TTPR.Server.Models.Tasks.Responses;

namespace TTPR.Server.Services.Tasks
{
    public class TaskService(AppDbContext context) : ITaskService
    {
        public async Task<CreateTaskResponseDTO?> CreateAsync(CreateTaskDTO request)
        {
            var task = new TaskItem {
                Title = request.Title,
                Description = request.Description,
                ProjectId = request.ProjectID,
                DueDate = request.DueDate,
                IsFinished = false
            };

            context.Tasks.Add(task);
            await context.SaveChangesAsync();

            return (new CreateTaskResponseDTO { message = "Task created successfully"});
        }

        public async Task<DeleteTaskResponseDTO?> DeleteAsync(DeleteTaskDTO request)
        {
            // todo - get userid later from project for security sake | other funcs too
            var task = await context.Tasks.FindAsync(request.TaskId);
            if (task is null)
                return null;

            context.Tasks.Remove(task);
            await context.SaveChangesAsync();

            return (new DeleteTaskResponseDTO { message = "Task deleted successfully" });
        }

        public async Task<List<TaskItem>?> GetAllAsync(Guid projectId)
        {
            var tasks = await context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();
            return tasks;
        }

        public async Task<TaskItem?> GetAsync(Guid taskId)
        {
            var task = await context.Tasks.FindAsync(taskId);
            if (task is null)
                return null;

            return task;
        }

        public async Task<UpdateTaskResponseDTO?> ChangeStatusAsync(Guid taskId)
        {
            var task = await context.Tasks.FindAsync(taskId);
            if (task is null)
                return null;

            task.IsFinished = !task.IsFinished;
            context.Tasks.Update(task);
            await context.SaveChangesAsync();

            return (new UpdateTaskResponseDTO { message = "Task status updated successfully" });
        }

        public async Task<UpdateTaskResponseDTO?> UpdateAsync(UpdateTaskDTO request)
        {
            var task = await context.Tasks.FindAsync(request.TaskId);
            if (task is null)
                return null;

            task.Title = request.Title;
            task.Description = request.Description;
            task.DueDate = request.DueDate;

            context.Tasks.Update(task);
            await context.SaveChangesAsync();

            return (new UpdateTaskResponseDTO { message = "Task updated successfully" });
        }
    }
}
