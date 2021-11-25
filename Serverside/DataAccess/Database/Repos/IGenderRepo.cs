using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public interface IGenderRepo
    {
        public Task<Gender> GetGenderByIdAsync(int id);
        public Task<List<Gender>> GetGendersAsync();
    }
}
