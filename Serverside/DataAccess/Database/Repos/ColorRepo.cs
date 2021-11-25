using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public class ColorRepo : IColorRepo
    {
        private readonly ShopDbContext _dbContext;

        public ColorRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Color> GetColorByIdAsync(int id)
        {
            return await _dbContext.Colors.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Color>> GetColorsAsync()
        {
            return await _dbContext.Colors.ToListAsync();
        }
    }
}
