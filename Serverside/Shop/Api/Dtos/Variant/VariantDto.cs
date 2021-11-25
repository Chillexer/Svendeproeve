using FNO.Shop.ShopApi.Dtos.Product;
using System.Collections.Generic;

namespace FNO.Shop.ShopApi.Dtos.Variant
{
    public class VariantDto : BaseVariantDto
    {
        public ProductDto Product { get; set; }
        public List<InventoryInfoDto> InventoryInfos { get; set; }
    }
}
