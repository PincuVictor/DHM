using AutoMapper;
using DHM.Application.DTOs;
using DHM.Application.Interfaces.Repositories;
using DHM.Application.Interfaces.Services;
using DHM.Domain.Entities;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DHM.Infrastructure.Data;

namespace DHM.Infrastructure.Services
{
    public class CartService : ICartService
    {
        private readonly DHMContext _context;
        private readonly IMapper _mapper;

        public CartService(DHMContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<CartDto?> GetCartByUserIdAsync(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);
                
            return cart == null ? null : _mapper.Map<CartDto>(cart);
        }

        public async Task<CartDto> AddItemToCartAsync(string userId, int productId, int quantity)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                throw new System.Exception("Product not found");
            }
            if (product.ReleaseDate.HasValue && product.ReleaseDate.Value > System.DateTime.UtcNow)
            {
                throw new System.Exception("Cannot add an upcoming drop to the cart before its release date");
            }

            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                await _context.Carts.AddAsync(cart);
                await _context.SaveChangesAsync();
            }

            var item = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                item.Quantity += quantity;
            }
            else
            {
                cart.CartItems.Add(new CartItem { ProductId = productId, Quantity = quantity });
            }

            await _context.SaveChangesAsync();
            return (await GetCartByUserIdAsync(userId))!;
        }

        public async Task RemoveItemFromCartAsync(string userId, int productId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                var item = cart.CartItems.FirstOrDefault(i => i.ProductId == productId);
                if (item != null)
                {
                    cart.CartItems.Remove(item);
                    await _context.SaveChangesAsync();
                }
            }
        }

        public async Task ClearCartAsync(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart != null)
            {
                cart.CartItems.Clear();
                await _context.SaveChangesAsync();
            }
        }
    }
}
