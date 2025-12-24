namespace TTPR.Server.Models.Projects.Requests
{
    public class CreateProjectDTO
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
