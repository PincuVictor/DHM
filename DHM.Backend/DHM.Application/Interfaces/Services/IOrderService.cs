using DHM.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DHM.Application.Interfaces.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<OrderDto>> GetUserOrdersAsync(string userId);
        Task<OrderDto?> GetOrderByIdAsync(int id);
        Task<OrderDto> CreateOrderAsync(string userId, CreateOrderDto orderDto);
        Task UpdateOrderStatusAsync(int id, string status);
    }
}
