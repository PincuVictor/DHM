namespace DHM.Application.DTOs
{
    public class ProductQueryParameters
    {
        public string? SearchTerm { get; set; }
        public int? CategoryId { get; set; }
        public bool? IsUpcoming { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
