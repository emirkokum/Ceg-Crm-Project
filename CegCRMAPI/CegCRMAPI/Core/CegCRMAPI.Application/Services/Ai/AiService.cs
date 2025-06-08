using CegCRMAPI.Application.Interfaces.Services;

namespace CegCRMAPI.Application.Services.Ai
{
    public class AiService : IAiService
    {
        public async Task<string> GetSolutionAsync(string ticketDescription)
        {
            await Task.Delay(500); // Gerçek API çağrısı gibi bekleme
            return $"AI çözüm önerisi (simülasyon): \"{ticketDescription}\" konusunu kontrol edin.";
        }
    }
}