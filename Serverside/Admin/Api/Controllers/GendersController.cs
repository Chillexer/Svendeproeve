using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FNO.Admin.AdminApi.Controllers
{
    [Authorize]
    [Route("api/genders")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class GendersController : ControllerBase
    {
        private readonly IGenderRepo _genderRepo;
        private readonly IMapper _mapper;

        public GendersController(IGenderRepo genderRepo, IMapper mapper)
        {
            _genderRepo = genderRepo;
            _mapper = mapper;
        }


        /// <summary>
        /// Henter alle køn
        /// </summary>
        /// <returns>Liste med alle køn</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<GenderDto>>> GetGendersAsync()
        {
            var genders = await _genderRepo.GetGendersAsync();

            return Ok(_mapper.Map<IEnumerable<GenderDto>>(genders));
        }
    }
}
