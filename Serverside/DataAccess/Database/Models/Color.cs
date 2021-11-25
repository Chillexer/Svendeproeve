using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.DataAccess.Database.Models
{
    public class Color
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string ColorName { get; set; }
        public string HexValue { get; set; }
        public List<Variant> Variants { get; set; }
    }
}
