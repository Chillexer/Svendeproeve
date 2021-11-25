using System.ComponentModel.DataAnnotations;

namespace FNO.User.UserApi.Dtos
{
    public class UpdateUserDto
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Town { get; set; }
        public int ZipCode { get; set; }
        public string Phone { get; set; }
    }
}
