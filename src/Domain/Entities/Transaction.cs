namespace Budgeto.Domain.Entities;

public class Transaction : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public decimal Amount { get; set; }
    public DateOnly Date { get; set; }
    public TransactionType Type { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public string? Notes { get; set; }
}
