using DHM.Domain.Entities;
using System.Threading.Tasks;

using System.Collections.Generic;
using DHM.Application.DTOs;

namespace DHM.Application.Interfaces.Repositories
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<Product?> GetProductWithCategoryAsync(int id);
        Task<(IEnumerable<Product> Products, int TotalCount)> GetProductsWithFiltersAsync(ProductQueryParameters parameters);
    }
}
