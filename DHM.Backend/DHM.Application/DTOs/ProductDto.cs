namespace DHM.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Size { get; set; }
        public int StockQuantity { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Size { get; set; }
        public int StockQuantity { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public int CategoryId { get; set; }
    }
}
