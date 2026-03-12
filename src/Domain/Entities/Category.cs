namespace Budgeto.Domain.Entities;

public class Category : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public string? Icon { get; set; }
    public TransactionType Type { get; set; }
}
