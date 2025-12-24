using TTPR.Server.Entities;
using TTPR.Server.Models.Projects.Requests;
using TTPR.Server.Models.Projects.Responses;

namespace TTPR.Server.Services.Projects
{
    public interface IProjectService
    {
        Task<CreateProjectResponseDTO?> CreateAsync(CreateProjectDTO request, Guid UserId);
        Task<Project?> GetAsync(Guid projectId, Guid UserId);
        Task<UpdateProjectResponseDTO?> UpdateAsync(UpdateProjectDTO request, Guid UserId);
        Task<DeleteProjectResponseDTO?> DeleteAsync(DeleteProjectDTO request, Guid UserId);
        Task<List<Project>?> GetAllAsync(Guid userId);
        Task<UpdateProjectResponseDTO?> GetProgressAsync(Guid projectId);
    }
}
