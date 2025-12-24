using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TTPR.Server.Entities;
using TTPR.Server.Models.Tasks.Requests;
using TTPR.Server.Models.Tasks.Responses;
using TTPR.Server.Services.Tasks;

namespace TTPR.Server.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class TaskController(ITaskService taskService) : ControllerBase
    {
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CreateTaskResponseDTO>> CreateTask([FromBody] CreateTaskDTO request)
        {
            var response = await taskService.CreateAsync(request);

            if (Response is null)
                return BadRequest("Failed to create the task.");

            return Ok(response);
        }

        [Authorize]
        [HttpGet("{taskId}")]
        public async Task<ActionResult<TaskItem>> GetTask(Guid taskId)
        {
            var response = await taskService.GetAsync(taskId);

            if (Response is null)
                return BadRequest("Failed to fetch the task.");

            return Ok(response);
        }

        [Authorize]
        [HttpGet("of/{projectId}")]
        public async Task<ActionResult<List<TaskItem>>> GetAllTasks(Guid projectId)
        {
            var response = await taskService.GetAllAsync(projectId);
            if (response is null)
                return BadRequest("Failed to get all the tasks of selected project.");

            return Ok(response);
        }

        [Authorize]
        [HttpDelete("{taskId}")]
        public async Task<ActionResult<DeleteTaskResponseDTO>> DeleteTask(Guid taskId, [FromBody] DeleteTaskDTO request)
        {
            var response = await taskService.DeleteAsync(request);
            if (response is null)
                return BadRequest("Failed to delete the task.");

            return Ok(response);
        }

        [Authorize]
        [HttpPatch("{taskId}")]
        public async Task<ActionResult<UpdateTaskResponseDTO>> UpdateTask(Guid taskId, [FromBody] UpdateTaskDTO request)
        {
            var response = await taskService.UpdateAsync(request);
            if (response is null)
                return BadRequest("Failed to update the task.");

            return Ok(response);
        }

        [Authorize]
        [HttpPatch("{taskId}/status")]
        public async Task<ActionResult<UpdateTaskResponseDTO>> ChangeTaskStatus(Guid taskId)
        {
            var response = await taskService.ChangeStatusAsync(taskId);
            if (response is null)
                return BadRequest("Failed to upodate the task.");

            return Ok(response);
        }

    }
}
