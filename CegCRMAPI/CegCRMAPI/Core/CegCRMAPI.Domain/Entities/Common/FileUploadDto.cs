using Microsoft.AspNetCore.Http;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Domain.Entities.Common
{
    public class FileUploadDto
    {
        [Required]
        [SwaggerSchema("The file to upload")]
        public IFormFile File { get; set; }
    }
}
