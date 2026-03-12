using Budgeto.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Budgeto.Infrastructure.Data.Configurations;

public class SavingsGoalConfiguration : IEntityTypeConfiguration<SavingsGoal>
{
    public void Configure(EntityTypeBuilder<SavingsGoal> builder)
    {
        builder.HasKey(s => s.Id);
        builder.Property(s => s.Name).IsRequired().HasMaxLength(100);
        builder.Property(s => s.TargetAmount).IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(s => s.CurrentAmount).IsRequired().HasColumnType("decimal(18,2)");
    }
}
