namespace Budgeto.Domain.Entities;

public class Category : BaseAuditableEntity, IAggregateRoot
{
    public string Name { get; set; } = null!;
    public string? Icon { get; set; }
    public TransactionType Type { get; set; }

    private readonly List<Transaction> _transactions = new();
    public IReadOnlyCollection<Transaction> Transactions => _transactions.AsReadOnly();

    private readonly List<Budget> _budgets = new();
    public IReadOnlyCollection<Budget> Budgets => _budgets.AsReadOnly();

    private readonly List<RecurringTransaction> _recurringTransactions = new();
    public IReadOnlyCollection<RecurringTransaction> RecurringTransactions => _recurringTransactions.AsReadOnly();
}
