using System.Collections.Generic;

namespace FNO.Shop.ShopApi.Dtos.Variant
{
    public class VariantWithoutProductDto : BaseVariantDto
    {
        public List<InventoryInfoDto> InventoryInfos { get; set; }
    }
}
