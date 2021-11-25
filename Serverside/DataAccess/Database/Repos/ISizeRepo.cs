using FNO.DataAccess.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Repos
{
    public interface ISizeRepo
    {
        public Task<Size> GetSizeByIdAsync(int id);
        public Task<List<Size>> GetSizesAsync();
        public Task<List<Size>> GetSizesBySizeType(SizeType type);
    }
}
