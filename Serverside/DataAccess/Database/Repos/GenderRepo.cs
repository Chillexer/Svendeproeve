using FNO.DataAccess.Database.Data;
using FNO.DataAccess.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.DataAccess.Database.Repos
{
    public class GenderRepo : IGenderRepo
    {
        private readonly ShopDbContext _dbContext;

        public GenderRepo(ShopDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Gender> GetGenderByIdAsync(int id)
        {
            return await _dbContext.Genders.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<List<Gender>> GetGendersAsync()
        {
            return await _dbContext.Genders.ToListAsync();
        }
    }
}
