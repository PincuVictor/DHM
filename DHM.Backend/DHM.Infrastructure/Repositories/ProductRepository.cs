using DHM.Application.Interfaces.Repositories;
using DHM.Domain.Entities;
using DHM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using DHM.Application.DTOs;

namespace DHM.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(DHMContext context) : base(context)
        {
        }

        public async Task<Product?> GetProductWithCategoryAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<(IEnumerable<Product> Products, int TotalCount)> GetProductsWithFiltersAsync(ProductQueryParameters parameters)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrWhiteSpace(parameters.SearchTerm))
            {
                var lowerTerm = parameters.SearchTerm.ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(lowerTerm) || (p.Description != null && p.Description.ToLower().Contains(lowerTerm)));
            }

            if (parameters.CategoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == parameters.CategoryId.Value);
            }

            if (parameters.IsUpcoming.HasValue)
            {
                var now = System.DateTime.UtcNow;
                if (parameters.IsUpcoming.Value)
                {
                    query = query.Where(p => p.ReleaseDate != null && p.ReleaseDate > now);
                }
                else
                {
                    query = query.Where(p => p.ReleaseDate == null || p.ReleaseDate <= now);
                }
            }

            var totalCount = await query.CountAsync();

            var products = await query
                .OrderBy(p => p.Id)
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();

            return (products, totalCount);
        }
    }
}
