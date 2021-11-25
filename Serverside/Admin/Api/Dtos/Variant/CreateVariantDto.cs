using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.Admin.AdminApi.Dtos.Variant
{
    public class CreateVariantDto
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public string ImagePath { get; set; }
        public decimal? DiscountPrice { get; set; }
        [Required]
        public List<int> ColorIds { get; set; }
        public List<CreateVariantInventoryInfoDto> InventoryInfos { get; set; }
    }
}
