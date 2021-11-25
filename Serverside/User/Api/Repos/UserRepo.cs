using FNO.User.UserApi.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FNO.User.UserApi.Repos
{
    public class UserRepo : IUserRepo
    {
        private readonly AppDbContext _dbContext;

        public UserRepo(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task CreateUserAsync(Models.User user)
        {
            await _dbContext.Users.AddAsync(user);
        }

        public async Task DeleteUserByEmailAsync(string email)
        {
            var user = await _dbContext.Users.FindAsync(new { Email = email });
            if (user == null) return;
            _dbContext.Users.Remove(user);
        }



        public async Task DeleteUserByIdAsync(Guid id)
        {
            var user = await _dbContext.Users.FindAsync(id);
            if (user == null) return;
            _dbContext.Users.Remove(user);
        }

        public async Task<Models.User> GetUserByEmailAsync(string email)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.Trim().ToLower());
        }
        public async Task<Models.User> GetUserByAuth0IdAsync(string userId)
        {
            return await _dbContext.Users.FirstOrDefaultAsync(u => u.Auth0Id == userId);
        }

        public async Task<Models.User> GetUserByIdAsync(Guid id)
        {
            return await _dbContext.Users.FindAsync(id);
        }

        public async Task<List<Models.User>> GetUsersAsync()
        {
            return await _dbContext.Users.Take(100).ToListAsync();
        }

        public async Task<List<Models.User>> SearchForUsersAsync(string search)
        {
            return await (from u in _dbContext.Users
                          where u.Email.Contains(search) || u.FirstName.Contains(search)
                          || u.LastName.Contains(search) || u.Phone.Contains(search)
                          orderby u.FirstName, u.LastName, u.Email
                          select u).Take(100).ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _dbContext.SaveChangesAsync();
        }

        public void UpdateUser(Models.User user)
        {
            _dbContext.Users.Update(user);
        }
    }
}
