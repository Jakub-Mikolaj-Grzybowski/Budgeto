namespace Budgeto.Domain.Entities;

public class SavingsGoal : BaseAuditableEntity, IAggregateRoot
{
    public string Name { get; set; } = null!;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public DateOnly? Deadline { get; set; }
}
