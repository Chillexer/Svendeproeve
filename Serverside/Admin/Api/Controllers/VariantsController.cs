using AutoMapper;
using FNO.Admin.AdminApi.Dtos.Variant;
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
    [Route("api/variants")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class VariantsController : ControllerBase
    {
        private readonly IVariantRepo _variantRepo;
        private readonly IProductRepo _productRepo;
        private readonly IColorRepo _colorRepo;
        private readonly ISizeRepo _sizeRepo;
        private readonly IMapper _mapper;

        public VariantsController(IVariantRepo variantRepo, IProductRepo productRepo, IColorRepo colorRepo, ISizeRepo sizeRepo, IMapper mapper)
        {
            _variantRepo = variantRepo;
            _productRepo = productRepo;
            _colorRepo = colorRepo;
            _sizeRepo = sizeRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Henter varianter
        /// </summary>
        /// <returns>Liste af varianter</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BaseVariantDto>>> GetVariantsAsync()
        {
            var variants = await _variantRepo.GetVariantsAsync();

            return Ok(_mapper.Map<IEnumerable<BaseVariantDto>>(variants));
        }

        /// <summary>
        /// Søger efter varianter
        /// </summary>
        /// <param name="search">Søge værdi</param>
        /// <returns>Liste af varianter</returns>
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<VariantDto>>> SearchForVariantsAsync([FromQuery] string search)
        {
            var variants = await _variantRepo.SearchForVariantsAsync(search);

            return Ok(_mapper.Map<IEnumerable<VariantDto>>(variants));
        }

        /// <summary>
        /// Henter variant udfra id
        /// </summary>
        /// <param name="id">Variant id</param>
        /// <returns>En variant</returns>
        [HttpGet("{id}", Name = nameof(GetVariantByIdAsync))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<VariantDto>> GetVariantByIdAsync(int id)
        {
            var variant = await _variantRepo.GetVariantByIdAsync(id);
            if (variant == null)
                return NotFound();

            return Ok(_mapper.Map<VariantDto>(variant));
        }


        /// <summary>
        /// Opretter en variant
        /// </summary>
        /// <param name="dto">Variant data</param>
        /// <returns>Oprettede variant</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<VariantDto>> CreateVariantAsync(CreateVariantDto dto)
        {
            var product = await _productRepo.GetProductByIdAsync(dto.ProductId);
            if (product == null)
                return BadRequest(new { errorMessage = "Product was not found" });

            if (dto.ColorIds.Count <= 0)
                return BadRequest(new { errorMessage = "Atleast one color has to be set" });

            var newVariant = _mapper.Map<Variant>(dto);

            newVariant.Colors = new List<Color>();

            foreach (var id in dto.ColorIds)
            {
                var color = await _colorRepo.GetColorByIdAsync(id);

                if (color == null)
                    return BadRequest(new { errorMessage = $"Color with id {id} was not found" });

                newVariant.Colors.Add(color);
            }

            newVariant.InventoryInfos = new List<InventoryInfo>();

            foreach (var inventoryInfo in dto.InventoryInfos)
            {
                if (inventoryInfo.TotalAmount < 0)
                    return BadRequest(new { errorMessage = "All TotalAmounts in InventoryInfos has to be positive" });
                var size = await _sizeRepo.GetSizeByIdAsync(inventoryInfo.SizeId);
                if (size == null)
                    return BadRequest(new { errorMessage = $"Size with id {inventoryInfo.SizeId} was not found" });

                newVariant.InventoryInfos.Add(new InventoryInfo() { TotalAmount = inventoryInfo.TotalAmount, SizeId = size.Id, Variant = newVariant });
            }

            await _variantRepo.CreateVariantAsync(newVariant);
            await _variantRepo.SaveChangesAsync();

            return CreatedAtRoute(nameof(GetVariantByIdAsync), new { newVariant.Id }, _mapper.Map<VariantDto>(newVariant));
        }


        /// <summary>
        /// Opdatere variant
        /// </summary>
        /// <param name="id">Id på variant</param>
        /// <param name="dto">Variant data</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<VariantDto>> UpdateVariantAsync(int id, UpdateVariantDto dto)
        {
            var variant = await _variantRepo.GetVariantByIdAsync(id);
            if (variant == null)
                return NotFound();

            var product = await _productRepo.GetProductByIdAsync(dto.ProductId);
            if (product == null)
                return BadRequest(new { errorMessage = "Product was not found" });

            if (dto.ColorIds.Count <= 0)
                return BadRequest(new { errorMessage = "Atleast one color has to be set" });

            _mapper.Map(dto, variant);

            variant.Colors.Clear();
            variant.InventoryInfos.Clear();

            foreach (var colorId in dto.ColorIds)
            {
                if (variant.Colors.FindIndex(c => c.Id == colorId) != -1)
                    continue;

                var color = await _colorRepo.GetColorByIdAsync(colorId);

                if (color == null)
                    return BadRequest(new { errorMessage = $"Color with id {colorId} was not found" });

                variant.Colors.Add(color);
            }

            foreach (var inventoryInfo in dto.InventoryInfos)
            {
                if (variant.InventoryInfos.FindIndex(i => i.SizeId == inventoryInfo.SizeId) != -1)
                    continue;

                if (inventoryInfo.TotalAmount < 0)
                    return BadRequest(new { errorMessage = "All TotalAmounts in InventoryInfos has to be positive" });
                var size = await _sizeRepo.GetSizeByIdAsync(inventoryInfo.SizeId);
                if (size == null)
                    return BadRequest(new { errorMessage = $"Size with id {inventoryInfo.SizeId} was not found" });

                variant.InventoryInfos.Add(new InventoryInfo() { TotalAmount = inventoryInfo.TotalAmount, SizeId = size.Id, Variant = variant });
            }

            _variantRepo.UpdateVariant(variant);
            await _variantRepo.SaveChangesAsync();

            return NoContent();
        }


        /// <summary>
        /// Sletter variant
        /// </summary>
        /// <param name="id">Id på variant</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteVariantAsync(int id)
        {
            var variant = await _variantRepo.GetVariantByIdAsync(id);

            if (variant == null)
                return Ok();

            await _variantRepo.DeleteVariantByIdAsync(id);
            await _variantRepo.SaveChangesAsync();

            return NoContent();
        }


    }
}
