using AutoMapper;
using FNO.DataAccess.Database.Repos;
using FNO.Shop.ShopApi.Dtos.Product;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.Shop.ShopApi.Controllers
{
    [Route("api/products")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepo _productRepo;
        private readonly IMapper _mapper;

        public ProductsController(IProductRepo productRepo, IMapper mapper)
        {
            _productRepo = productRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Henter produkt ud fra id
        /// </summary>
        /// <param name="id">Id på produkt</param>
        /// <returns>Et produkt</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductWithVariantsDto>> GetProductByIdAsync(int id)
        {
            var product = await _productRepo.GetProductByIdAsync(id);
            if (product == null)
                return NotFound();

            return Ok(_mapper.Map<ProductWithVariantsDto>(product));
        }

        /// <summary>
        /// Henter produkter udfra køn
        /// </summary>
        /// <param name="genderId">Id på køn</param>
        /// <returns>Liste med produkter</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> GetProductsByGenderAsync([FromQuery] int genderId)
        {
            var products = await _productRepo.GetProductsByGenderAsync(genderId);
            if (products == null)
                return NotFound();

            return Ok(_mapper.Map<ProductDto>(products));

        }


        /// <summary>
        /// Henter alle mærker udfra køn og eventuelt kategori
        /// </summary>
        /// <param name="gender">Køn</param>
        /// <param name="category">Kategori</param>
        /// <returns>Liste med mærker</returns>
        [HttpGet("brands")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<string>>> GetBrandsAsync([FromQuery] string gender, [FromQuery] string category)
        {
            if (string.IsNullOrWhiteSpace(gender))
                return BadRequest();

            return Ok(await _productRepo.GetBrandsAsync(gender, category));
        }

    }
}
