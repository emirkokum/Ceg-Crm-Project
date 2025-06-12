using CegCRMAPI.Application.DTOs.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CegCRMAPI.Infrastructure.Helpers
{
    public static class EnumHelper
    {
        public static List<EnumDto> ConvertToList<T>() where T : Enum
        {
            return Enum.GetValues(typeof(T))
                .Cast<T>()
                .Select(e => new EnumDto
                {
                    Value = Convert.ToInt32(e),
                    Label = e.GetType()
                             .GetMember(e.ToString())
                             .First()
                             .GetCustomAttributes(typeof(DisplayAttribute), false)
                             .Cast<DisplayAttribute>()
                             .FirstOrDefault()?.Name ?? e.ToString()
                })
                .ToList();
        }
    }

}
