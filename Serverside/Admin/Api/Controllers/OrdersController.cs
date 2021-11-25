using AutoMapper;
using FNO.Admin.AdminApi.Dtos.Order;
using FNO.DataAccess.Database.Mail;
using FNO.DataAccess.Database.Models;
using FNO.DataAccess.Database.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FNO.DataAccess.Database.Models.Enums;

namespace FNO.Admin.AdminApi.Controllers
{
    [Authorize]
    [Route("api/orders")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderRepo _orderRepo;
        private readonly IVariantRepo _variantRepo;
        private readonly IMapper _mapper;

        public OrdersController(IOrderRepo orderRepo, IVariantRepo variantRepo, IMapper mapper)
        {
            _orderRepo = orderRepo;
            _variantRepo = variantRepo;
            _mapper = mapper;
        }

        /// <summary>
        /// Søger efter alle ordrer udfra tekst og status
        /// </summary>
        /// <param name="search">søgetekst</param>
        /// <param name="statuses">ordre statusser</param>
        /// <returns>Liste med odrer</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<BaseOrderDto>>> GetOrdersAsync([FromQuery] string search, [FromQuery(Name = "statuses[]")] List<OrderStatus> statuses)
        {
            if (statuses == null)
                statuses = new List<OrderStatus>();

            var orders = await _orderRepo.SearchForOrdersAsync(search, statuses);

            return Ok(_mapper.Map<IEnumerable<BaseOrderDto>>(orders));
        }


        /// <summary>
        /// Henter ordrer diagramdata ud fra de sidste 7 dage 
        /// </summary>
        /// <returns>Liste med diagramdata</returns>
        [HttpGet("last7days")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<OrderKeyValue>>> GetOrdersForLast7DaysAsync()
        {
            var orders = await _orderRepo.GetOrdersFromLast7DayDaysAsync();

            return Ok(orders);
        }

        /// <summary>
        /// Henter en ordre ud efter et id
        /// </summary>
        /// <param name="id">id på ordre</param>
        /// <returns>En ordre</returns>
        [HttpGet("{id}", Name = nameof(GetOrderByIdAsync))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDto>> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepo.GetOrderByIdAsync(id);
            if (order == null)
                return NotFound();

            var dto = _mapper.Map<OrderDto>(order);

            return Ok(dto);
        }


        /// <summary>
        /// Opretter en ordre og sender mail til email
        /// </summary>
        /// <param name="dto">alle oplysninger omkring den nye ordre</param>
        /// <returns>Oprettede ordre</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<BaseOrderDto>> CreateOrderAsync(CreateOrderDto dto)
        {
            if (dto.VariantOrders.Count <= 0)
                return BadRequest(new { errorMessage = "Variants cannot be empty" });


            var newOrder = _mapper.Map<Order>(dto);

            newOrder.Status = Enums.OrderStatus.New;
            newOrder.VariantOrders = new List<VariantOrder>();

            foreach (var variantOrder in dto.VariantOrders)
            {
                var variant = await _variantRepo.GetVariantByIdAsync(variantOrder.VariantId, true);
                if (variant == null)
                    return BadRequest(new { errorMessage = "Variant was not found" });

                var inventoryInfo = variant.InventoryInfos.FirstOrDefault(i => i.SizeId == variantOrder.SizeId);
                if (inventoryInfo == null)
                    return BadRequest(new { errorMessage = "Size does not exist on variant" });

                inventoryInfo.TotalAmount -= variantOrder.OrderedItemsTotal;

                var newVariantOrder = new VariantOrder()
                {
                    DiscountPrice = variant.DiscountPrice,
                    Price = variant.Product.Price,
                    OrderedItemsTotal = variantOrder.OrderedItemsTotal,
                    SizeId = variantOrder.SizeId,
                    Variant = variant,
                };

                newOrder.VariantOrders.Add(newVariantOrder);
            }

            await _orderRepo.CreateOrderAsync(newOrder);
            await _orderRepo.SaveChangesAsync();

            var order = await _orderRepo.GetOrderByIdAsync(newOrder.Id);
            Mail.SendMail(order);

            return CreatedAtRoute(nameof(GetOrderByIdAsync), new { newOrder.Id }, _mapper.Map<BaseOrderDto>(newOrder));
        }


        /// <summary>
        /// Opdatere status på en ordre
        /// </summary>
        /// <param name="id">Id på ordre</param>
        /// <param name="dto">Data som skal opdateres</param>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateOrderAsync(int id, UpdateOrderDto dto)
        {

            var order = await _orderRepo.GetOrderByIdAsync(id);

            if (order == null)
                return NotFound();

            order.Status = dto.Status;

            _orderRepo.UpdateOrder(order);
            await _orderRepo.SaveChangesAsync();

            return NoContent();
        }


        /// <summary>
        /// Sletter en ordre
        /// </summary>
        /// <param name="id">Id på ordre</param>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteOrderAsync(int id)
        {
            var order = await _orderRepo.GetOrderByIdAsync(id);

            if (order == null)
                return Ok();

            await _orderRepo.DeleteOrderByIdAsync(id);
            await _orderRepo.SaveChangesAsync();

            return NoContent();
        }

    }
}
