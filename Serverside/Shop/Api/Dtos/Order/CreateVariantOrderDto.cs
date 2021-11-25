using System.ComponentModel.DataAnnotations;

namespace FNO.Shop.ShopApi.Dtos.Order
{
    public class CreateVariantOrderDto
    {
        [Required]
        public int SizeId { get; set; }
        [Required]
        public int VariantId { get; set; }
        [Required]
        public int OrderedItemsTotal { get; set; }
    }
}
