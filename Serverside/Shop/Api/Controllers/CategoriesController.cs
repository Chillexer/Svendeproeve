using FNO.DataAccess.Database.Models;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace FNO.Shop.ShopApi.Controllers
{
    [Route("api/categories")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepo _categoryRepo;

        public CategoriesController(ICategoryRepo categoryRepo)
        {
            _categoryRepo = categoryRepo;
        }

        /// <summary>
        /// Returnere kategorier ud fra køn
        /// </summary>
        /// <param name="gender">Køn</param>
        /// <returns>Liste med kategorier</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<NestedCategory>> GetCategoriesByGenderAsync(string gender)
        {
            var products = await _categoryRepo.GetCategoriesByGenderAsync(gender);

            return Ok(products.FirstOrDefault());
        }
    }
}
