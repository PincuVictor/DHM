using AutoMapper;
using DHM.Application.DTOs;
using DHM.Application.Interfaces.Repositories;
using DHM.Application.Interfaces.Services;
using DHM.Domain.Entities;
using DHM.Infrastructure.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DHM.UnitTests.Services
{
    public class OrderServiceTests
    {
        private readonly Mock<IGenericRepository<Order>> _mockOrderRepo;
        private readonly Mock<IGenericRepository<Product>> _mockProductRepo;
        private readonly Mock<ICartService> _mockCartService;
        private readonly Mock<IMapper> _mockMapper;
        private readonly OrderService _orderService;

        public OrderServiceTests()
        {
            _mockOrderRepo = new Mock<IGenericRepository<Order>>();
            _mockProductRepo = new Mock<IGenericRepository<Product>>();
            _mockCartService = new Mock<ICartService>();
            _mockMapper = new Mock<IMapper>();

            _orderService = new OrderService(
                _mockOrderRepo.Object,
                _mockProductRepo.Object,
                _mockCartService.Object,
                _mockMapper.Object
            );
        }

        [Fact]
        public async Task CreateOrderAsync_EmptyCart_ThrowsException()
        {
            // Arrange
            var userId = "user1";
            _mockCartService.Setup(cs => cs.GetCartByUserIdAsync(userId)).ReturnsAsync(new CartDto { CartItems = new List<CartItemDto>() });

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _orderService.CreateOrderAsync(userId, new CreateOrderDto()));
        }

        [Fact]
        public async Task CreateOrderAsync_InsufficientStock_ThrowsException()
        {
            // Arrange
            var userId = "user1";
            var cart = new CartDto
            {
                CartItems = new List<CartItemDto>
                {
                    new CartItemDto { ProductId = 1, Quantity = 5, UnitPrice = 10 }
                }
            };
            _mockCartService.Setup(cs => cs.GetCartByUserIdAsync(userId)).ReturnsAsync(cart);

            var product = new Product { Id = 1, StockQuantity = 2, Name = "Test Shirt" };
            _mockProductRepo.Setup(pr => pr.GetByIdAsync(1)).ReturnsAsync(product);

            var createOrderDto = new CreateOrderDto();
            _mockMapper.Setup(m => m.Map<Order>(createOrderDto)).Returns(new Order());

            // Act & Assert
            var ex = await Assert.ThrowsAsync<Exception>(() => _orderService.CreateOrderAsync(userId, createOrderDto));
            Assert.Contains("Insufficient stock", ex.Message);
        }

        [Fact]
        public async Task CreateOrderAsync_Success_DeductsStockAndClearsCart()
        {
            // Arrange
            var userId = "user1";
            var cart = new CartDto
            {
                CartItems = new List<CartItemDto>
                {
                    new CartItemDto { ProductId = 1, Quantity = 2, UnitPrice = 10 }
                }
            };
            _mockCartService.Setup(cs => cs.GetCartByUserIdAsync(userId)).ReturnsAsync(cart);

            var product = new Product { Id = 1, StockQuantity = 5, Name = "Test Shirt" };
            _mockProductRepo.Setup(pr => pr.GetByIdAsync(1)).ReturnsAsync(product);

            var createOrderDto = new CreateOrderDto();
            _mockMapper.Setup(m => m.Map<Order>(createOrderDto)).Returns(new Order());
            _mockMapper.Setup(m => m.Map<OrderDto>(It.IsAny<Order>())).Returns(new OrderDto());

            // Act
            await _orderService.CreateOrderAsync(userId, createOrderDto);

            // Assert
            Assert.Equal(3, product.StockQuantity); // Stock deducted
            _mockProductRepo.Verify(pr => pr.UpdateAsync(product), Times.Once); // Product updated
            _mockOrderRepo.Verify(or => or.AddAsync(It.IsAny<Order>()), Times.Once); // Order added
            _mockCartService.Verify(cs => cs.ClearCartAsync(userId), Times.Once); // Cart cleared
        }
    }
}
