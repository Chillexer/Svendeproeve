using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.DataAccess.Database.Models;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FNO.Admin.AdminApi.Controllers
{
    [Authorize]
    [Route("api/sizes")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class SizesController : ControllerBase
    {
        private readonly ISizeRepo _sizeRepo;
        private readonly IProductRepo _productRepo;
        private readonly IMapper _mapper;

        public SizesController(ISizeRepo sizeRepo, IProductRepo productRepo, IMapper mapper)
        {
            _sizeRepo = sizeRepo;
            _productRepo = productRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Henter størrelser udfra et produktid
        /// </summary>
        /// <param name="productId">produktid</param>
        /// <returns>Liste af størrelser</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<SizeDto>>> GetSizesAsync([FromQuery] int? productId)
        {
            List<Size> sizes;

            if (!productId.HasValue)
            {
                sizes = await _sizeRepo.GetSizesAsync();
            }
            else
            {
                var product = await _productRepo.GetProductByIdAsync(productId.Value);
                if (product == null)
                    return NotFound(new { errorMessage = "Product not found" });

                sizes = await _sizeRepo.GetSizesBySizeType(product.SizeType);
            }

            return Ok(_mapper.Map<IEnumerable<SizeDto>>(sizes));
        }
    }
}
