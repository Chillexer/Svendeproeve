using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.DataAccess.Database.Models
{
    public class Size
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string SizeName { get; set; }
        [Required]
        public Enums.SizeType SizeType { get; set; }
        public List<InventoryInfo> InventoryInfos { get; set; }
    }
}
