using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public interface IColorRepo
    {
        public Task<Color> GetColorByIdAsync(int id);
        public Task<List<Color>> GetColorsAsync();
    }
}
