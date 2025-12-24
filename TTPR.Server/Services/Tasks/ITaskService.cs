using TTPR.Server.Entities;
using TTPR.Server.Models.Tasks.Requests;
using TTPR.Server.Models.Tasks.Responses;

namespace TTPR.Server.Services.Tasks
{
    public interface ITaskService
    {
        Task<CreateTaskResponseDTO?> CreateAsync(CreateTaskDTO request);
        Task<DeleteTaskResponseDTO?> DeleteAsync(DeleteTaskDTO request);
        Task<UpdateTaskResponseDTO?> UpdateAsync(UpdateTaskDTO request);
        Task<TaskItem?> GetAsync(Guid taskId);
        Task<List<TaskItem>?> GetAllAsync(Guid projectId);
        Task<UpdateTaskResponseDTO?> ChangeStatusAsync(Guid taskId);
    }
}
