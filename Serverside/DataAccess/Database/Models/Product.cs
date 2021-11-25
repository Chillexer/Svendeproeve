using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FNO.DataAccess.Database.Models
{
    public class Product : BaseEntity
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Brand { get; set; }
        [Required]
        public string Model { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int GenderId { get; set; }
        [Required]
        public Gender Gender { get; set; }
        [Required]
        [Column(TypeName = "decimal(8,2)")]
        public decimal Price { get; set; }
        [Required]
        public Enums.SizeType SizeType { get; set; }
        public List<Variant> Variants { get; set; }
        [Required]
        public List<Category> Categories { get; set; }

    }
}
