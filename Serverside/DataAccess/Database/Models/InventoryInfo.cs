using System.ComponentModel.DataAnnotations;

namespace FNO.DataAccess.Database.Models
{
    public class InventoryInfo
    {
        [Required]
        public int VariantId { get; set; }
        [Required]
        public Variant Variant { get; set; }
        [Required]
        public int SizeId { get; set; }
        [Required]
        public Size Size { get; set; }
        [Required]
        public int TotalAmount { get; set; }
    }
}
