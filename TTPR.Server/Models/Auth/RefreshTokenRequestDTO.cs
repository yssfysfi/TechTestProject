namespace TTPR.Server.Models.Auth
{
    public class RefreshTokenRequestDTO
    {
        public Guid UserID { get; set; }
        public required string refreshToken { get; set; }
    }
}
