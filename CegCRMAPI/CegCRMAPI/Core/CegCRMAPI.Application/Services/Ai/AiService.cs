using CegCRMAPI.Application.Interfaces.Services;
using System.Net.Http.Json;
using System.Text.Json;

namespace CegCRMAPI.Application.Services.Ai
{
    public class AiService : IAiService
    {
        private readonly HttpClient _httpClient;

        public AiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<string> GetSolutionAsync(string description)
        {
            var requestBody = new { text = description };

            var response = await _httpClient.PostAsJsonAsync("http://localhost:8000/predict", requestBody);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);
                var suggestion = doc.RootElement.GetProperty("suggestion").GetString();
                return suggestion ?? "AI'dan çözüm alınamadı.";
            }

            return $"AI servis hatası: {response.StatusCode}";
        }

        public async Task<bool> UploadKnowledgeBaseAsync(Stream fileStream, string fileName)
        {
            var content = new MultipartFormDataContent();
            content.Add(new StreamContent(fileStream), "file", fileName);

            var response = await _httpClient.PostAsync("http://localhost:8000/upload", content);

            var body = await response.Content.ReadAsStringAsync(); // 🔍 bu satır eklendi

            if (!response.IsSuccessStatusCode)
                throw new Exception($"AI servisi hatası: {response.StatusCode} - {body}");

            return true;
        }
    }
}