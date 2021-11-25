using AutoMapper;
using FNO.DataAccess.Database.Repos;
using FNO.Shop.ShopApi.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.Shop.ShopApi.Controllers
{
    [Route("api/sizes")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class SizesController : ControllerBase
    {
        private readonly ISizeRepo _sizeRepo;
        private readonly IMapper _mapper;

        public SizesController(ISizeRepo sizeRepo, IMapper mapper)
        {
            _sizeRepo = sizeRepo;
            _mapper = mapper;
        }


        /// <summary>
        /// Henter størrelser udfra størrelse type
        /// </summary>
        /// <param name="sizeType">Størrelse type</param>
        /// <returns>Liste med størrelser</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<SizeDto>>> GetSizesByTypeAsync([FromQuery] SizeType sizeType)
        {
            var sizes = await _sizeRepo.GetSizesBySizeType(sizeType);

            return Ok(_mapper.Map<IEnumerable<SizeDto>>(sizes));
        }
    }
}
