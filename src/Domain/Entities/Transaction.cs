namespace Budgeto.Domain.Entities;

public class Transaction : BaseAuditableEntity, IAggregateRoot
{
    public string Name { get; private set; } = null!;
    public decimal Amount { get; private set; }
    public DateOnly Date { get; private set; }
    public TransactionType Type { get; private set; }
    public int CategoryId { get; private set; }
    public Category Category { get; private set; } = null!;
    public string? Notes { get; private set; }

    private Transaction() { }

    public static Transaction Create(string name, decimal amount, DateOnly date,
        TransactionType type, int categoryId, string? notes = null)
    {
        var transaction = new Transaction
        {
            Name = name,
            Amount = amount,
            Date = date,
            Type = type,
            CategoryId = categoryId,
            Notes = notes,
        };
        transaction.AddDomainEvent(new TransactionCreatedEvent(transaction));
        return transaction;
    }

    public void Update(string name, decimal amount, DateOnly date,
        TransactionType type, int categoryId, string? notes = null)
    {
        Name = name;
        Amount = amount;
        Date = date;
        Type = type;
        CategoryId = categoryId;
        Notes = notes;
    }
}
