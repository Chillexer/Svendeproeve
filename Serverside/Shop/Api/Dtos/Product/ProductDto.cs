using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos.Variant;
using System.Collections.Generic;

namespace FNO.Shop.ShopApi.Dtos.Product
{
    public class ProductDto : BaseProductDto
    {
        public string Description { get; set; }
        public int GenderId { get; set; }
        public GenderDto Gender { get; set; }
        public Enums.SizeType SizeType { get; set; }
        public List<BaseVariantDto> Variants { get; set; }
        public List<CategoryDto> Categories { get; set; }
    }
}
