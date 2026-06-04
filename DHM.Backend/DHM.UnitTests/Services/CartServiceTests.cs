using AutoMapper;
using DHM.Application.DTOs;
using DHM.Domain.Entities;
using DHM.Infrastructure.Data;
using DHM.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;

namespace DHM.UnitTests.Services
{
    public class CartServiceTests : IDisposable
    {
        private readonly DHMContext _context;
        private readonly Mock<IMapper> _mockMapper;
        private readonly CartService _cartService;

        public CartServiceTests()
        {
            var options = new DbContextOptionsBuilder<DHMContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new DHMContext(options);
            _mockMapper = new Mock<IMapper>();

            // Setup mock mapper just enough for GetCartByUserIdAsync
            _mockMapper.Setup(m => m.Map<CartDto>(It.IsAny<Cart>())).Returns((Cart c) => new CartDto { UserId = c.UserId });

            _cartService = new CartService(_context, _mockMapper.Object);
        }

        [Fact]
        public async Task AddItemToCartAsync_NewProduct_AddsToCart()
        {
            // Arrange
            var userId = "user1";
            var product = new Product { Id = 1, Name = "Test Product", StockQuantity = 10 };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Act
            await _cartService.AddItemToCartAsync(userId, 1, 2);

            // Assert
            var cart = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == userId);
            Assert.NotNull(cart);
            Assert.Single(cart.CartItems);
            Assert.Equal(1, cart.CartItems.First().ProductId);
            Assert.Equal(2, cart.CartItems.First().Quantity);
        }

        [Fact]
        public async Task AddItemToCartAsync_ExistingProduct_IncrementsQuantity()
        {
            // Arrange
            var userId = "user1";
            var product = new Product { Id = 1, Name = "Test Product", StockQuantity = 10 };
            _context.Products.Add(product);
            
            var cart = new Cart { UserId = userId };
            cart.CartItems.Add(new CartItem { ProductId = 1, Quantity = 2 });
            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();

            // Act
            await _cartService.AddItemToCartAsync(userId, 1, 3);

            // Assert
            var updatedCart = await _context.Carts.Include(c => c.CartItems).FirstOrDefaultAsync(c => c.UserId == userId);
            Assert.NotNull(updatedCart);
            Assert.Single(updatedCart.CartItems);
            Assert.Equal(5, updatedCart.CartItems.First().Quantity); // 2 + 3
        }

        [Fact]
        public async Task AddItemToCartAsync_UpcomingProduct_ThrowsException()
        {
            // Arrange
            var userId = "user1";
            var upcomingProduct = new Product { 
                Id = 1, 
                Name = "Future Drop", 
                StockQuantity = 10,
                ReleaseDate = DateTime.UtcNow.AddDays(5) 
            };
            _context.Products.Add(upcomingProduct);
            await _context.SaveChangesAsync();

            // Act & Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => _cartService.AddItemToCartAsync(userId, 1, 1));
            Assert.Contains("Cannot add an upcoming drop", ex.Message);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
