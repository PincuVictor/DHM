namespace DHM.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Size { get; set; }
        public int StockQuantity { get; set; }
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public bool IsActive { get; set; } = true;

        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}
