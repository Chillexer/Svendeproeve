using AutoMapper;
using FNO.DataAccess.Database.Mail;
using FNO.DataAccess.Database.Models;
using FNO.DataAccess.Database.Repos;
using FNO.Shop.ShopApi.Dtos.Order;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FNO.Shop.ShopApi.Controllers
{
    [Route("api/orders")]
    [ApiController]
    [Produces("application/json")]
    [Consumes("application/json")]
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
        /// Henter ordre udfra email og id på ordre
        /// </summary>
        /// <param name="id">Id på ordre</param>
        /// <param name="email">Email</param>
        /// <returns>En ordre</returns>
        [HttpGet("{id}", Name = nameof(GetOrderByEmailAndIdAsync))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderDto>> GetOrderByEmailAndIdAsync(int id, [FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
                return BadRequest();

            var order = await _orderRepo.GetOrderByEmailAndIdAsync(id, email);
            if (order == null)
                return NotFound();

            var dto = _mapper.Map<OrderDto>(order);

            return Ok(dto);
        }


        /// <summary>
        /// Opretter en ordre
        /// </summary>
        /// <param name="dto">ordre data</param>
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

            return CreatedAtRoute(nameof(GetOrderByEmailAndIdAsync), new { newOrder.Id, email = newOrder.Email }, _mapper.Map<BaseOrderDto>(newOrder));
        }

    }
}
