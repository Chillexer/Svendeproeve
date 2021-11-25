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
    [Route("api/categories")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepo _categoryRepo;
        private readonly IGenderRepo _genderRepo;

        public CategoriesController(ICategoryRepo categoryRepo, IGenderRepo genderRepo)
        {
            _categoryRepo = categoryRepo;
            _genderRepo = genderRepo;
        }



        /// <summary>
        /// Søger efter kategorier udfra køn og kategori navm
        /// </summary>
        /// <param name="genderId">Id på køn</param>
        /// <param name="name">Kategori der søges efter</param>
        /// <returns>Liste med kategorier</returns>
        [HttpGet("{genderId}/search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<CategorySearch>>> SearchByGenderIdAndCategoryNameAsync(int genderId, [FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                name = "";

            var gender = (await _genderRepo.GetGenderByIdAsync(genderId))?.GenderName;
            if (string.IsNullOrWhiteSpace(gender))
                return NotFound();

            var products = await _categoryRepo.SearchByNameAsync(gender, name);

            return Ok(products);
        }
    }
}
