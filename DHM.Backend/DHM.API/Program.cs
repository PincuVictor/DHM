using DHM.Domain.Entities;
using DHM.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Add Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add DbContext
builder.Services.AddDbContext<DHMContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"),
        b => b.MigrationsAssembly("DHM.Infrastructure"));
    options.ConfigureWarnings(warnings => 
        warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

// Add AutoMapper
builder.Services.AddAutoMapper(cfg => {
    cfg.AddProfile<DHM.Application.Mappings.MappingProfile>();
});

// Add Repositories
builder.Services.AddScoped(typeof(DHM.Application.Interfaces.Repositories.IGenericRepository<>), typeof(DHM.Infrastructure.Repositories.GenericRepository<>));
builder.Services.AddScoped<DHM.Application.Interfaces.Repositories.IProductRepository, DHM.Infrastructure.Repositories.ProductRepository>();

// Add Services
builder.Services.AddScoped<DHM.Application.Interfaces.Services.IAuthService, DHM.Infrastructure.Services.AuthService>();
builder.Services.AddScoped<DHM.Application.Interfaces.Services.IProductService, DHM.Infrastructure.Services.ProductService>();
builder.Services.AddScoped<DHM.Application.Interfaces.Services.ICategoryService, DHM.Infrastructure.Services.CategoryService>();
builder.Services.AddScoped<DHM.Application.Interfaces.Services.IOrderService, DHM.Infrastructure.Services.OrderService>();
builder.Services.AddScoped<DHM.Application.Interfaces.Services.ICartService, DHM.Infrastructure.Services.CartService>();
builder.Services.AddScoped<DHM.Application.Interfaces.Services.IEmailService, DHM.Infrastructure.Services.EmailService>();
builder.Services.AddScoped<DHM.Application.Interfaces.Services.IShippingService, DHM.Infrastructure.Services.ShippingService>();

// Add Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<DHMContext>()
    .AddDefaultTokenProviders();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secret = jwtSettings["Secret"] ?? throw new InvalidOperationException("JWT Secret not found.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
    };
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<DHM.API.Middleware.ExceptionMiddleware>();

app.UseCors("AllowAll");

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var dbContext = services.GetRequiredService<DHMContext>();
        await dbContext.Database.MigrateAsync();
        await DHM.Infrastructure.Data.DbSeeder.SeedRolesAndAdminAsync(services);
        if (dbContext.Database.IsRelational())
        {
            await dbContext.Database.ExecuteSqlRawAsync("UPDATE \"AspNetUsers\" SET \"EmailConfirmed\" = true;");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

app.Run();

public partial class Program { }