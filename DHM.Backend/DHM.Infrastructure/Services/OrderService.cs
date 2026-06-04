using AutoMapper;
using DHM.Application.DTOs;
using DHM.Application.Interfaces.Repositories;
using DHM.Application.Interfaces.Services;
using DHM.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DHM.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IGenericRepository<Order> _orderRepository;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly ICartService _cartService;
        private readonly IMapper _mapper;

        public OrderService(IGenericRepository<Order> orderRepository, IGenericRepository<Product> productRepository, ICartService cartService, IMapper mapper)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _cartService = cartService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(string userId)
        {
            var orders = await _orderRepository.GetAllAsync();
            var userOrders = orders.Where(o => o.UserId == userId).ToList();
            return _mapper.Map<IEnumerable<OrderDto>>(userOrders);
        }

        public async Task<OrderDto?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            return order == null ? null : _mapper.Map<OrderDto>(order);
        }

        public async Task<OrderDto> CreateOrderAsync(string userId, CreateOrderDto orderDto)
        {
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            if (cart == null || !cart.CartItems.Any())
            {
                throw new System.Exception("Cannot create an order from an empty cart.");
            }

            var order = _mapper.Map<Order>(orderDto);
            order.UserId = userId;
            order.CreatedAt = System.DateTime.UtcNow;
            order.UpdatedAt = System.DateTime.UtcNow;
            order.Status = "Pending";
            
            decimal totalPrice = 0;
            foreach (var item in cart.CartItems)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product == null)
                {
                    throw new System.Exception($"Product with ID {item.ProductId} no longer exists.");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    throw new System.Exception($"Insufficient stock for {product.Name}. Available: {product.StockQuantity}, Requested: {item.Quantity}");
                }

                // Deduct stock
                product.StockQuantity -= item.Quantity;
                await _productRepository.UpdateAsync(product);

                totalPrice += item.UnitPrice * item.Quantity;
                order.OrderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                });
            }
            order.TotalPrice = totalPrice;

            await _orderRepository.AddAsync(order);

            // Clear the cart after successful order creation
            await _cartService.ClearCartAsync(userId);

            return _mapper.Map<OrderDto>(order);
        }

        public async Task UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order != null)
            {
                order.Status = status;
                order.UpdatedAt = System.DateTime.UtcNow;
                await _orderRepository.UpdateAsync(order);
            }
        }
    }
}
