using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.Admin.AdminApi.Controllers
{
    [Authorize]
    [Route("api/colors")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class ColorsController : ControllerBase
    {
        private readonly IColorRepo _ColorRepo;
        private readonly IMapper _mapper;

        public ColorsController(IColorRepo ColorRepo, IMapper mapper)
        {
            _ColorRepo = ColorRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Henter alle farver
        /// </summary>
        /// <returns>En liste med farver</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ColorDto>>> GetColorsAsync()
        {
            var Colors = await _ColorRepo.GetColorsAsync();

            return Ok(_mapper.Map<IEnumerable<ColorDto>>(Colors));
        }
    }
}
