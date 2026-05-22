using DHM.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DHM.Application.Interfaces.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<PaginatedResultDto<ProductDto>> GetProductsWithFiltersAsync(ProductQueryParameters parameters);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto productDto);
        Task UpdateProductAsync(int id, CreateProductDto productDto);
        Task DeleteProductAsync(int id);
    }
}
