using Budgeto.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgeto.Infrastructure.Data.Configurations;

public class NetWorthAccountConfiguration : IEntityTypeConfiguration<NetWorthAccount>
{
    public void Configure(EntityTypeBuilder<NetWorthAccount> builder)
    {
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Name).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Balance).IsRequired().HasColumnType("decimal(18,2)");
        builder.HasOne(a => a.Category).WithMany().HasForeignKey(a => a.CategoryId);
    }
}
