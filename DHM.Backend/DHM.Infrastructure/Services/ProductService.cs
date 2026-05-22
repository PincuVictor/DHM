using AutoMapper;
using DHM.Application.DTOs;
using DHM.Application.Interfaces.Repositories;
using DHM.Application.Interfaces.Services;
using DHM.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DHM.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<PaginatedResultDto<ProductDto>> GetProductsWithFiltersAsync(ProductQueryParameters parameters)
        {
            var result = await _productRepository.GetProductsWithFiltersAsync(parameters);
            var dtos = _mapper.Map<IEnumerable<ProductDto>>(result.Products);
            
            return new PaginatedResultDto<ProductDto>
            {
                Items = dtos,
                TotalCount = result.TotalCount,
                PageNumber = parameters.PageNumber,
                PageSize = parameters.PageSize
            };
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetProductWithCategoryAsync(id);
            return product == null ? null : _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);
            await _productRepository.AddAsync(product);
            return _mapper.Map<ProductDto>(product);
        }

        public async Task UpdateProductAsync(int id, CreateProductDto productDto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product != null)
            {
                _mapper.Map(productDto, product);
                await _productRepository.UpdateAsync(product);
            }
        }

        public async Task DeleteProductAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product != null)
            {
                await _productRepository.DeleteAsync(product);
            }
        }
    }
}
