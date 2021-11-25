using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.DataAccess.Database.Repos
{
    public class SizeRepo : ISizeRepo
    {
        private readonly ShopDbContext _dbContext;

        public SizeRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<Size> GetSizeByIdAsync(int id)
        {
            return await _dbContext.Sizes.FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<List<Size>> GetSizesAsync()
        {
            return await _dbContext.Sizes.ToListAsync();
        }

        public async Task<List<Size>> GetSizesBySizeType(SizeType type)
        {
            return await _dbContext.Sizes.Where(s => s.SizeType == type).OrderBy(s => s.SizeName).ToListAsync();
        }
    }
}
