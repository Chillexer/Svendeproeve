using Auth0.ManagementApi.Models;
using AutoMapper;
using FNO.User.UserApi.Dtos;
using FNO.User.UserApi.IntegrationClients;
using FNO.User.UserApi.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FNO.User.UserApi.Controllers
{
    [Authorize]
    [Route("api/users")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class UsersController : ControllerBase
    {
        private readonly IManagementClient _managementClient;
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;

        public UsersController(IManagementClient client, IMapper mapper, IUserRepo userRepo)
        {
            _managementClient = client ?? throw new ArgumentNullException(nameof(client));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userRepo = userRepo ?? throw new ArgumentNullException(nameof(userRepo));
        }

        /// <summary>
        /// Henter nuværende bruger oplysninger
        /// </summary>
        /// <returns>Bruger oplysninger</returns>
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDto>> GetAuthenticatedUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return BadRequest();

            var user = await _userRepo.GetUserByAuth0IdAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(_mapper.Map<UserDto>(user));
        }


        /// <summary>
        /// Henter en liste af brugere
        /// </summary>
        /// <returns>Liste af brugere</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersAsync([FromQuery] string search)
        {
            List<Models.User> users;

            if (string.IsNullOrWhiteSpace(search))
                users = await _userRepo.GetUsersAsync();
            else
                users = await _userRepo.SearchForUsersAsync(search);

            return Ok(_mapper.Map<IEnumerable<UserDto>>(users));
        }

        /// <summary>
        /// Henter bruger udfra id
        /// </summary>
        /// <param name="id">Bruger id</param>
        /// <returns>Bruger oplysninger</returns>
        [HttpGet("{id}", Name = nameof(GetUserByIdAsync))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDto>> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepo.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(id);

            return Ok(_mapper.Map<UserDto>(user));
        }

        /// <summary>
        /// Henter en bruger udfra en mail
        /// </summary>
        /// <param name="email">Brugers email</param>
        /// <returns>Bruger oplysninger</returns>
        [HttpGet("{id}/email", Name = nameof(GetUserByEmailAsync))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<UserDto>> GetUserByEmailAsync(string email)
        {
            var user = await _userRepo.GetUserByEmailAsync(email);
            if (user == null)
                return NotFound(email);

            return Ok(_mapper.Map<UserDto>(user));
        }


        /// <summary>
        /// Opretter en bruger
        /// </summary>
        /// <param name="dto">Bruger oplysninger</param>
        /// <returns>Oprettede bruger</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateUserAsync([FromBody] CreateUserDto dto)
        {
            if ((await _managementClient.Client.Users.GetUsersByEmailAsync(dto.Email)).Count > 0)
                return BadRequest(new { errorMessage = "Bruger findes allerede!!!" });
            if (await _userRepo.GetUserByEmailAsync(dto.Email) != null)
                return BadRequest(new { errorMessage = "Bruger findes allerede!!!" });

            var userRequest = _mapper.Map<UserCreateRequest>(dto);
            userRequest.Connection = "Username-Password-Authentication";
            var userResponse = await _managementClient.Client.Users.CreateAsync(userRequest);

            var user = _mapper.Map<Models.User>(dto);
            user.ImageUrl = userResponse.Picture;
            user.Auth0Id = userResponse.UserId;
            await _userRepo.CreateUserAsync(user);
            await _userRepo.SaveChangesAsync();

            var newUserDto = _mapper.Map<UserDto>(user);

            return CreatedAtRoute(nameof(GetUserByIdAsync), new { newUserDto.Id }, newUserDto);
        }

        /// <summary>
        /// Opdatere en bruger
        /// </summary>
        /// <param name="id">Id på bruger</param>
        /// <param name="dto">Bruger oplysninger</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUserAsync(Guid id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userRepo.GetUserByIdAsync(id);

            if (user == null)
                return NotFound();

            _mapper.Map(dto, user);
            _userRepo.UpdateUser(user);
            await _userRepo.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Sletter en bruger på Auth0 og i databasen
        /// </summary>
        /// <param name="id">Bruger id</param>
        /// <returns>NoContent Response if successfull</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUserAsync(Guid id)
        {
            var user = await _userRepo.GetUserByIdAsync(id);
            if (user == null)
                return NoContent();

            await _userRepo.DeleteUserByIdAsync(id);
            await _managementClient.Client.Users.DeleteAsync(user.Auth0Id);
            await _userRepo.SaveChangesAsync();

            return NoContent();
        }
    }
}
