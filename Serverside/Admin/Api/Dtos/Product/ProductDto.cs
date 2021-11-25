using FNO.Admin.AdminApi.Dtos.Variant;
using FNO.DataAccess.Database.Models;
using System.Collections.Generic;

namespace FNO.Admin.AdminApi.Dtos.Product
{
    public class ProductDto : BaseProductDto
    {
        public string Description { get; set; }
        public int GenderId { get; set; }
        public GenderDto Gender { get; set; }
        public Enums.SizeType SizeType { get; set; }
        public List<BaseVariantDto> Variants { get; set; }
        public List<CategorySearchDto> Categories { get; set; }
    }
}
