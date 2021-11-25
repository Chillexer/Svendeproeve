using FNO.Admin.AdminApi.Dtos.Product;
using System.Collections.Generic;

namespace FNO.Admin.AdminApi.Dtos.Variant
{
    public class VariantDto : BaseVariantDto
    {
        public ProductDto Product { get; set; }
        public List<InventoryInfoDto> InventoryInfos { get; set; }
    }
}
