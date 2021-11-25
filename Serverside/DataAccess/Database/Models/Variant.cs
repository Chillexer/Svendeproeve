using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FNO.DataAccess.Database.Models
{
    public class Variant : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        public Product Product { get; set; }
        [Required]
        public string ImagePath { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        public decimal? DiscountPrice { get; set; }
        [Required]
        public List<Color> Colors { get; set; }
        public List<VariantOrder> VariantOrders { get; set; }
        public List<InventoryInfo> InventoryInfos { get; set; }
    }
}
