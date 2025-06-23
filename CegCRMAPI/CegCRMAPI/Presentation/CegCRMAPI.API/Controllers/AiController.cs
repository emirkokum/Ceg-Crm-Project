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
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadKnowledgeBase([FromForm] FileUploadDto request)
        {
            var file = request.File;

            if (file == null || file.Length == 0)
                return BadRequest("Geçerli bir dosya yüklenmedi.");

            using var stream = file.OpenReadStream();
            var result = await _aiService.UploadKnowledgeBaseAsync(stream, file.FileName);

            return result
                ? Ok("Dosya başarıyla yüklendi.")
                : StatusCode(500, "AI servisine dosya gönderilirken bir hata oluştu.");
        }
    }
}
