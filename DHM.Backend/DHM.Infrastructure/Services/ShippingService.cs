using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DHM.Application.DTOs;
using DHM.Application.Interfaces.Services;
using DHM.Domain.Entities;
using DHM.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace DHM.Infrastructure.Services
{
    public class ShippingService : IShippingService
    {
        private readonly DHMContext _context;

        public ShippingService(DHMContext context)
        {
            _context = context;
        }

        private ShippingAddressDto MapToDto(ShippingAddress entity)
        {
            return new ShippingAddressDto
            {
                Id = entity.Id,
                Address_line1 = entity.AddressLine1,
                Address_line2 = entity.AddressLine2,
                City = entity.City,
                Postal_code = entity.PostalCode,
                Country = entity.Country
            };
        }

        public async Task<IEnumerable<ShippingAddressDto>> GetUserAddressesAsync(string userId)
        {
            var addresses = await _context.ShippingAddresses
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return addresses.Select(MapToDto);
        }

        public async Task<ShippingAddressDto> GetAddressByIdAsync(string userId, int addressId)
        {
            var address = await _context.ShippingAddresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null) return null!;

            return MapToDto(address);
        }

        public async Task<ShippingAddressDto> CreateAddressAsync(string userId, CreateUpdateShippingAddressDto dto)
        {
            var address = new ShippingAddress
            {
                UserId = userId,
                AddressLine1 = dto.Address_line1,
                AddressLine2 = dto.Address_line2,
                City = dto.City,
                PostalCode = dto.Postal_code,
                Country = dto.Country
            };

            await _context.ShippingAddresses.AddAsync(address);
            await _context.SaveChangesAsync();

            return MapToDto(address);
        }

        public async Task<ShippingAddressDto> UpdateAddressAsync(string userId, int addressId, CreateUpdateShippingAddressDto dto)
        {
            var address = await _context.ShippingAddresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address == null) throw new Exception("Address not found");

            address.AddressLine1 = dto.Address_line1;
            address.AddressLine2 = dto.Address_line2;
            address.City = dto.City;
            address.PostalCode = dto.Postal_code;
            address.Country = dto.Country;

            _context.ShippingAddresses.Update(address);
            await _context.SaveChangesAsync();

            return MapToDto(address);
        }

        public async Task DeleteAddressAsync(string userId, int addressId)
        {
            var address = await _context.ShippingAddresses
                .FirstOrDefaultAsync(a => a.Id == addressId && a.UserId == userId);

            if (address != null)
            {
                _context.ShippingAddresses.Remove(address);
                await _context.SaveChangesAsync();
            }
        }
    }
}
