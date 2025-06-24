using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CegCRMAPI.Application.Common.Interfaces; // IAiService burada tanımlı olmalı
using System.Threading.Tasks;
using CegCRMAPI.Application.Interfaces.Services;
using CegCRMAPI.Domain.Entities.Common;

namespace CegCRMAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AiController : ControllerBase
    {
        private readonly IAiService _aiService;

        public AiController(IAiService aiService)
        {
            _aiService = aiService;
        }

        [HttpPost("upload-doc")]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadKnowledgeBase([FromForm] FileUploadDto request)
        {
            var file = request.File;

            if (file == null || file.Length == 0)
                return BadRequest("File is empty or null.");

            using var stream = file.OpenReadStream();
            var result = await _aiService.UploadKnowledgeBaseAsync(stream, file.FileName);

            return result
                ? Ok("Dosya başarıyla yüklendi.")
                : StatusCode(500, "AI servisine dosya gönderilirken bir hata oluştu.");
        }

        [HttpGet("documents")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllDocuments()
        {
            try
            {
                var result = await _aiService.GetAllDocumentsAsync();
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching documents: {ex.Message}");
            }
        }

        [HttpDelete("documents/{fileName}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDocumentByFileName(string fileName)
        {
            try
            {
                var result = await _aiService.DeleteDocumentByFileNameAsync(fileName);
                return Content(result, "application/json");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error deleting document: {ex.Message}");
            }
        }

    }
}
