using Budgeto.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgeto.Infrastructure.Data.Configurations;

public class NetWorthSnapshotConfiguration : IEntityTypeConfiguration<NetWorthSnapshot>
{
    public void Configure(EntityTypeBuilder<NetWorthSnapshot> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.TotalAssets).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(s => s.TotalLiabilities).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(s => s.NetWorth).IsRequired().HasColumnType("decimal(18,2)");
        builder.HasIndex(s => new { s.Month, s.Year }).IsUnique();
    }
}
