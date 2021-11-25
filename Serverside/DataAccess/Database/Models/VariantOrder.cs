using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FNO.DataAccess.Database.Models
{
    public class VariantOrder
    {
        [Key]
        public int Id { get; set; }
        public int SizeId { get; set; }
        public Size Size { get; set; }
        [Required]
        public int VariantId { get; set; }
        [Required]
        public Variant Variant { get; set; }
        [Required]
        public int OrderId { get; set; }
        [Required]
        public Order Order { get; set; }
        [Required]
        public int OrderedItemsTotal { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        public decimal? DiscountPrice { get; set; }
    }
}
