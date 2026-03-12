using Budgeto.Domain.ValueObjects;

namespace Budgeto.Domain.Entities;

public class Budget : BaseAuditableEntity, IAggregateRoot
{
    public string Name { get; private set; } = null!;
    public Money Amount { get; private set; } = null!;
    public Money? WeeklyLimit { get; private set; }
    public int CategoryId { get; private set; }
    public Category Category { get; private set; } = null!;
    public int Month { get; private set; }
    public int Year { get; private set; }

    private Budget() { }

    public static Budget Create(string name, Money amount, int categoryId, int month, int year, Money? weeklyLimit = null)
    {
        var budget = new Budget
        {
            Name = name,
            Amount = amount,
            WeeklyLimit = weeklyLimit,
            CategoryId = categoryId,
            Month = month,
            Year = year,
        };
        budget.AddDomainEvent(new BudgetCreatedEvent(budget));
        return budget;
    }

    public void Update(string name, Money amount, int categoryId, int month, int year, Money? weeklyLimit = null)
    {
        Name = name;
        Amount = amount;
        WeeklyLimit = weeklyLimit;
        CategoryId = categoryId;
        Month = month;
        Year = year;
    }

    public bool IsExceeded(decimal spent) => spent > Amount.Amount;

    public decimal GetRemaining(decimal spent) => Amount.Amount - spent;
}
