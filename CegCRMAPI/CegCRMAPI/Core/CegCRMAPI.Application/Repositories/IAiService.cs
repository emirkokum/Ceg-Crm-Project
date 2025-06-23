namespace CegCRMAPI.Application.Interfaces.Services
{
    public interface IAiService
    {
        Task<string> GetSolutionAsync(string ticketDescription);
        Task<bool> UploadKnowledgeBaseAsync(Stream fileStream, string fileName);
    }
}