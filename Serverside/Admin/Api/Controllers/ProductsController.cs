using AutoMapper;
using FNO.Admin.AdminApi.Dtos;
using FNO.Admin.AdminApi.Dtos.Product;
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
    [Route("api/products")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepo _productRepo;
        private readonly ICategoryRepo _categoryRepo;
        private readonly IGenderRepo _genderRepo;
        private readonly IMapper _mapper;

        public ProductsController(IProductRepo productRepo, ICategoryRepo categoryRepo, IGenderRepo genderRepo, IMapper mapper)
        {
            _productRepo = productRepo;
            _categoryRepo = categoryRepo;
            _genderRepo = genderRepo;
            _mapper = mapper;
        }


        /// <summary>
        /// Henter produkter som matcher med søgekriterier
        /// </summary>
        /// <param name="search">Værdi som der søges efter</param>
        /// <returns>Liste med produkter</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BaseProductDto>>> GetProductsAsync([FromQuery] string search)
        {
            List<Product> products;

            if (string.IsNullOrEmpty(search))
                products = await _productRepo.GetProductsAsync();
            else
                products = await _productRepo.SearchForProductsAsync(search);

            return Ok(_mapper.Map<IEnumerable<BaseProductDto>>(products));
        }


        /// <summary>
        /// Henter produkt udfra et id
        /// </summary>
        /// <param name="id">Id på produkt</param>
        /// <returns>Et produkt</returns>
        [HttpGet("{id}", Name = nameof(GetProductByIdAsync))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto>> GetProductByIdAsync(int id)
        {
            var product = await _productRepo.GetProductByIdAsync(id);
            if (product == null)
                return NotFound();

            var dto = _mapper.Map<ProductDto>(product);

            dto.Categories = new List<CategorySearchDto>();

            foreach (var category in product.Categories)
            {
                dto.Categories.Add(_mapper.Map<CategorySearchDto>(await _categoryRepo.SearchByIdAsync(dto.Gender.GenderName, category.Id)));
            }

            return Ok(dto);
        }


        /// <summary>
        /// Opretter et produkt
        /// </summary>
        /// <param name="dto">produkt oplysninger</param>
        /// <returns>Oprettede produkt</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ProductDto>> CreateProductAsync(CreateProductDto dto)
        {
            if (dto.CategoryIds.Count <= 0)
                return BadRequest(new { errorMessage = "Categories cannot be empty" });

            var newProduct = _mapper.Map<Product>(dto);

            newProduct.Categories = new List<Category>();

            newProduct.Gender = await _genderRepo.GetGenderByIdAsync(newProduct.GenderId);
            if (newProduct.Gender == null)
                return BadRequest(new { errorMessage = "Gender was not found" });

            foreach (var categoryId in dto.CategoryIds)
            {
                var category = await _categoryRepo.GetCategoryByIdAsync(categoryId);
                if (category == null)
                    return BadRequest(new { errorMessage = $"Category with id {categoryId} does not exist" });

                if ((await _categoryRepo.SearchByIdAsync(newProduct.Gender.GenderName, category.Id)) == null)
                    return BadRequest(new { errorMessage = $"Category with id {categoryId} does not exist in gender type" });

                newProduct.Categories.Add(category);
            }

            await _productRepo.CreateProductAsync(newProduct);
            await _productRepo.SaveChangesAsync();


            return CreatedAtRoute(nameof(GetProductByIdAsync), new { newProduct.Id }, _mapper.Map<ProductDto>(newProduct));
        }


        /// <summary>
        /// Opdatere et produkt
        /// </summary>
        /// <param name="id">Produkt id</param>
        /// <param name="dto">Produkt oplysninger</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateProductAsync(int id, UpdateProductDto dto)
        {
            var product = await _productRepo.GetProductByIdAsync(id);

            if (product == null)
                return NotFound();

            _mapper.Map(dto, product);

            product.Gender = await _genderRepo.GetGenderByIdAsync(product.GenderId);
            if (product.Gender == null)
                return BadRequest(new { errorMessage = "Gender was not found" });

            foreach (var categoryId in dto.CategoryIds)
            {
                if (product.Categories.FindIndex(c => c.Id == categoryId) != -1)
                    continue;

                var category = await _categoryRepo.GetCategoryByIdAsync(categoryId);
                if (category == null)
                    return BadRequest(new { errorMessage = $"Category with id {categoryId} does not exist" });

                if ((await _categoryRepo.SearchByIdAsync(product.Gender.GenderName, category.Id)) == null)
                    return BadRequest(new { errorMessage = $"Category with id {categoryId} does not exist in gender type" });

                product.Categories.Add(category);
            }

            product.Categories.RemoveAll(c => !dto.CategoryIds.Contains(c.Id));

            _productRepo.UpdateProduct(product);
            await _productRepo.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Sletter et produkt
        /// </summary>
        /// <param name="id">Produkt id</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteProductAsync(int id)
        {
            var product = await _productRepo.GetProductByIdAsync(id);

            if (product == null)
                return Ok();

            await _productRepo.DeleteProductByIdAsync(id);
            await _productRepo.SaveChangesAsync();

            return NoContent();
        }

    }
}
