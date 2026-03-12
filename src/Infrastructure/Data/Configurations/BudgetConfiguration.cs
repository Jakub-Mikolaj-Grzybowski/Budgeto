using Budgeto.Domain.Entities;
using Budgeto.Infrastructure.Data.Converters;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgeto.Infrastructure.Data.Configurations;

public class BudgetConfiguration : IEntityTypeConfiguration<Budget>
{
    public void Configure(EntityTypeBuilder<Budget> builder)
    {
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Name).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Amount)
            .IsRequired()
            .HasColumnType("decimal(18,2)")
            .HasConversion(new MoneyConverter());
        builder.Property(b => b.WeeklyLimit)
            .HasColumnType("decimal(18,2)")
            .HasConversion(new NullableMoneyConverter());
        builder
            .HasOne(b => b.Category)
            .WithMany(c => c.Budgets)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(b => new { b.Year, b.Month });
    }
}
