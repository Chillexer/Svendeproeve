using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.User.UserApi.Repos
{
    public interface IUserRepo
    {
        public Task SaveChangesAsync();
        public Task<Models.User> GetUserByAuth0IdAsync(string userId);
        public Task<Models.User> GetUserByIdAsync(Guid id);
        public Task<Models.User> GetUserByEmailAsync(string email);
        public Task<List<Models.User>> GetUsersAsync();
        public Task<List<Models.User>> SearchForUsersAsync(string search);
        public Task CreateUserAsync(Models.User user);
        public void UpdateUser(Models.User user);
        public Task DeleteUserByIdAsync(Guid id);
        public Task DeleteUserByEmailAsync(string email);
    }
}
