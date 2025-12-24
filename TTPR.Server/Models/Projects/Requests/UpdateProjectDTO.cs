namespace TTPR.Server.Models.Projects.Requests
{
    public class UpdateProjectDTO
    {
        public Guid ProjectId { get; set;}
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
