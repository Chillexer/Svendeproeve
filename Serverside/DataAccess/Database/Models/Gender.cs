using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.DataAccess.Database.Models
{
    public class Gender
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string GenderName { get; set; }
        public List<Product> Products { get; set; }

    }
}
