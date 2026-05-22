using System.Threading.Tasks;
using DHM.Application.DTOs;

namespace DHM.Application.Interfaces.Services
{
    public interface ICartService
    {
        Task<CartDto?> GetCartByUserIdAsync(string userId);
        Task<CartDto> AddItemToCartAsync(string userId, int productId, int quantity);
        Task RemoveItemFromCartAsync(string userId, int productId);
        Task ClearCartAsync(string userId);
    }
}
