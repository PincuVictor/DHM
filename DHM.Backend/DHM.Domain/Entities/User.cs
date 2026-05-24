using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace DHM.Domain.Entities
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;

        public string? VerificationCode { get; set; }
        public System.DateTime? VerificationCodeExpiry { get; set; }

        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<ShippingAddress> ShippingAddresses { get; set; } = new List<ShippingAddress>();
        public Cart? Cart { get; set; }
    }
}
