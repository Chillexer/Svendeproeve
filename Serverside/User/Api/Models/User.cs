using System;
using System.ComponentModel.DataAnnotations;

namespace FNO.User.UserApi.Models
{
    public class User : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        public string Auth0Id { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Town { get; set; }
        public int ZipCode { get; set; }
        [Required]
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ImageUrl { get; set; }
    }
}
