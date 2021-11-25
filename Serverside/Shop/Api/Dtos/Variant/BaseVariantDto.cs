using System.Collections.Generic;

namespace FNO.Shop.ShopApi.Dtos.Variant
{
    public class BaseVariantDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImagePath { get; set; }
        public decimal? DiscountPrice { get; set; }
        public List<ColorDto> Colors { get; set; }
    }
}
