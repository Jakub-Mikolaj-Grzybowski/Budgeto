namespace Budgeto.Domain.Entities;

public class NetWorthAccount : BaseAuditableEntity, IAggregateRoot
{
    public string Name { get; set; } = null!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public decimal Balance { get; set; }
    public DateOnly? RepaymentDate { get; set; }
}
