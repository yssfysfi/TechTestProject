
namespace TTPR.Server.Models.Tasks.Requests
{
    public class CreateTaskDTO
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid ProjectID { get; set; }
        public DateTime DueDate { get; set; }
    }
}
