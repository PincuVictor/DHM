using System.Collections.Generic;
using System.Threading.Tasks;
using DHM.Application.DTOs;

namespace DHM.Application.Interfaces.Services
{
    public interface IShippingService
    {
        Task<IEnumerable<ShippingAddressDto>> GetUserAddressesAsync(string userId);
        Task<ShippingAddressDto> GetAddressByIdAsync(string userId, int addressId);
        Task<ShippingAddressDto> CreateAddressAsync(string userId, CreateUpdateShippingAddressDto dto);
        Task<ShippingAddressDto> UpdateAddressAsync(string userId, int addressId, CreateUpdateShippingAddressDto dto);
        Task DeleteAddressAsync(string userId, int addressId);
    }
}
