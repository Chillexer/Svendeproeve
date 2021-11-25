using FNO.DataAccess.Database.Models;
using FNO.Shop.ShopApi.Dtos.Variant;
using System.Collections.Generic;

namespace FNO.Shop.ShopApi.Dtos.Product
{
    public class ProductWithVariantsDto
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public Enums.SizeType SizeType { get; set; }
        public List<VariantWithoutProductDto> Variants { get; set; }
    }
}
