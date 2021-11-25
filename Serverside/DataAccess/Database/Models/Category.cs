using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.DataAccess.Database.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CategoryName { get; set; }
        [Required]
        public int Left { get; set; }
        [Required]
        public int Right { get; set; }
        public List<Product> Products { get; set; }
    }
}
