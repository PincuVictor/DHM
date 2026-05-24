namespace DHM.Application.DTOs
{
    public class ShippingAddressDto
    {
        public int Id { get; set; }
        public string Address_line1 { get; set; } = string.Empty;
        public string? Address_line2 { get; set; }
        public string City { get; set; } = string.Empty;
        public string Postal_code { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }

    public class CreateUpdateShippingAddressDto
    {
        public string Address_line1 { get; set; } = string.Empty;
        public string? Address_line2 { get; set; }
        public string City { get; set; } = string.Empty;
        public string Postal_code { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
