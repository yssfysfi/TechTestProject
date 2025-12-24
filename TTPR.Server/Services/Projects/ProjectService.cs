using Microsoft.EntityFrameworkCore;
using TTPR.Server.Data;
using TTPR.Server.Entities;
using TTPR.Server.Models.Projects.Requests;
using TTPR.Server.Models.Projects.Responses;

namespace TTPR.Server.Services.Projects
{
    public class ProjectService(AppDbContext context) : IProjectService
    {
        public async Task<CreateProjectResponseDTO?> CreateAsync(CreateProjectDTO request, Guid userId)
        {
            var project = new Project { 
                Title = request.Title,
                UserId = userId,
                Description = request.Description
            };


            context.Projects.Add(project);
            await context.SaveChangesAsync();

            return (new CreateProjectResponseDTO {message = "Project created successfully"});            
        }

        public async Task<DeleteProjectResponseDTO?> DeleteAsync(DeleteProjectDTO request, Guid userId)
        {
            var project = await context.Projects.FindAsync(request.ProjectId);
            if (project is null || project.UserId != userId)
                return null;
            
            context.Projects.Remove(project);
            await context.SaveChangesAsync();

            return (new DeleteProjectResponseDTO { message = "Project deleted successfully" });
        }

        public async Task<Project?> GetAsync(Guid projectId, Guid userId)
        {
            var project = await context.Projects.FindAsync(projectId);
            if (project is null || project.UserId != userId)
                return null;

            return project;
        }

        public async Task<List<Project>?> GetAllAsync(Guid userId)
        {
            var projects = await context.Projects.Where(p => p.UserId == userId).ToListAsync();

            return projects;
        }

        public async Task<UpdateProjectResponseDTO?> UpdateAsync(UpdateProjectDTO request, Guid userId)
        {
            var project = await context.Projects.FindAsync(request.ProjectId);

            if (project is null || project.UserId != userId)
                return null;

            project.Title = request.Title;
            project.Description = request.Description;

            context.Projects.Update(project);
            await context.SaveChangesAsync();

            return (new UpdateProjectResponseDTO { message = "Project updated successfully" });
        }

        public async Task<UpdateProjectResponseDTO?> GetProgressAsync(Guid projectId)
        {
            var tasks = await context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();
            var finished = tasks.Count(t => t.IsFinished);
            var progress = tasks.Count() == 0 ? 0 : (double)finished / tasks.Count();
            
            return (new UpdateProjectResponseDTO { message = progress.ToString() }); ;
        }
    }
}
