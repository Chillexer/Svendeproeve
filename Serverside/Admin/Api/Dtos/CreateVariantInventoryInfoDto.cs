using System.ComponentModel.DataAnnotations;

namespace FNO.Admin.AdminApi.Dtos
{
    public class CreateVariantInventoryInfoDto
    {
        [Required]
        public int SizeId { get; set; }
        [Required]
        public int TotalAmount { get; set; }
    }
}
