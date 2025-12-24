using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TTPR.Server.Entities;
using TTPR.Server.Models.Projects.Requests;
using TTPR.Server.Models.Projects.Responses;
using TTPR.Server.Services.Projects;

namespace TTPR.Server.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class ProjectController(IProjectService projectService) : ControllerBase
    {

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CreateProjectResponseDTO>> CreateProject([FromBody] CreateProjectDTO request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var response = await projectService.CreateAsync(request, userId);

            if (response is null)
                return BadRequest("Failed to create the project.");

            return Ok(response);
        }

        [Authorize]
        [HttpGet("{projectId}")]
        public async Task<ActionResult<Project>> GetProject(Guid projectId)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var response = await projectService.GetAsync(projectId, userId);

            if (response is null)
                return BadRequest("Failed to fetch the project.");


            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<Project>>> GetAllProjects()
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var response = await projectService.GetAllAsync(userId);
            
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("{projectId}")]
        public async Task<ActionResult<DeleteProjectResponseDTO>> DeleteProject(Guid projectId, [FromBody] DeleteProjectDTO request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var response = await projectService.DeleteAsync(request, userId);

            if (response is null)
                return BadRequest("Failed to delete the project.");

            return Ok(response);
        }

        [Authorize]
        [HttpPatch("{projectId}")]
        public async Task<ActionResult<UpdateProjectResponseDTO>> UpdateProject(Guid projectId,[FromBody]  UpdateProjectDTO request)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var response = await projectService.UpdateAsync(request, userId);

            if (response is null)
                return BadRequest("Failed to update the project");

            return Ok(response);
        }

        [Authorize]
        [HttpGet("progress/{projectId}")]
        public async Task<ActionResult<UpdateProjectResponseDTO>> GetProgress(Guid projectId)
        {
            var response = await projectService.GetProgressAsync(projectId);
            return Ok(response);
        }
    }
}
