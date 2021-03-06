using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FNO.Admin.AdminApi.Dtos.Product
{
    public class CreateProductDto
    {
        [Required]
        public string Brand { get; set; }
        [Required]
        public string Model { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public int GenderId { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public Enums.SizeType SizeType { get; set; }
        [Required]
        public List<int> CategoryIds { get; set; }
    }
}
