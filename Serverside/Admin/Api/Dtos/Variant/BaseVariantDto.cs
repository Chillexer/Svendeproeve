using System;
using System.Collections.Generic;

namespace FNO.Admin.AdminApi.Dtos.Variant
{
    public class BaseVariantDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImagePath { get; set; }
        public decimal? DiscountPrice { get; set; }
        public List<ColorDto> Colors { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
