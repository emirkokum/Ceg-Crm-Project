namespace CegCRMAPI.Application.Interfaces.Services
{
    public interface IAiService
    {
        Task<string> GetSolutionAsync(string ticketDescription);
    }
}