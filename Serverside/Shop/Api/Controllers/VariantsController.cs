using AutoMapper;
using FNO.DataAccess.Database.Repos;
using FNO.Shop.ShopApi.Dtos.Variant;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.Shop.ShopApi.Controllers
{
    [Route("api/variants")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class VariantsController : ControllerBase
    {
        private readonly IVariantRepo _variantRepo;
        private readonly IMapper _mapper;

        public VariantsController(IVariantRepo variantRepo, IMapper mapper)
        {
            _variantRepo = variantRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Henter varianter ud fra forskellige søge kriterier
        /// </summary>
        /// <param name="gender">Køn</param>
        /// <param name="category">Kategori</param>
        /// <param name="brand">Mærke</param>
        /// <param name="sizeType">Størrelse type</param>
        /// <param name="sizeId">Størrelse id</param>
        /// <param name="priceFrom">Pris fra</param>
        /// <param name="priceTo">Pris til</param>
        /// <returns>Liste med varianter</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<VariantDto>>> GetVariantsAsync([FromQuery] string gender, [FromQuery] string category, [FromQuery] string brand
            , [FromQuery] SizeType? sizeType, [FromQuery] int? sizeId, [FromQuery] int? priceFrom, [FromQuery] int? priceTo)
        {
            if (string.IsNullOrWhiteSpace(gender))
                return BadRequest();

            var variants = await _variantRepo.SearchVariantsByGenderAndCategoryAsync(gender, category, brand, sizeType, sizeId, priceFrom, priceTo);

            return Ok(_mapper.Map<IEnumerable<VariantDto>>(variants));
        }


        /// <summary>
        /// Søger efter varianter
        /// </summary>
        /// <param name="search">Søge tekst</param>
        /// <returns>Liste med varianter</returns>
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<VariantDto>>> SearchForVariantsAsync([FromQuery] string search)
        {
            var variants = await _variantRepo.SearchForVariantsAsync(search);

            return Ok(_mapper.Map<IEnumerable<VariantDto>>(variants));
        }

        /// <summary>
        /// Henter top6 solgte varianter ud
        /// </summary>
        /// <returns>Liste med varianter</returns>
        [HttpGet("top6")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<VariantDto>>> GetTop6SellingVariantsAsync()
        {
            var variants = await _variantRepo.GetTop6SellingVaraintsAsync();

            return Ok(_mapper.Map<IEnumerable<VariantDto>>(variants));
        }
    }
}
