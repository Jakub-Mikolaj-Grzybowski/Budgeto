namespace Budgeto.Domain.ValueObjects;

public class Money : ValueObject
{
    public decimal Amount { get; private set; }

    private Money() { }

    private Money(decimal amount) => Amount = amount;

    public static Money Of(decimal amount)
    {
        if (amount < 0)
            throw new ArgumentException("Monetary amount cannot be negative.", nameof(amount));
        return new Money(amount);
    }

    public static Money Zero => new(0m);

    public Money Add(Money other) => new(Amount + other.Amount);
    public Money Subtract(Money other) => new(Amount - other.Amount);

    public static Money operator +(Money a, Money b) => a.Add(b);
    public static Money operator -(Money a, Money b) => a.Subtract(b);
    public static bool operator >(Money a, Money b) => a.Amount > b.Amount;
    public static bool operator <(Money a, Money b) => a.Amount < b.Amount;
    public static bool operator >=(Money a, Money b) => a.Amount >= b.Amount;
    public static bool operator <=(Money a, Money b) => a.Amount <= b.Amount;

    public static implicit operator decimal(Money money) => money.Amount;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Amount;
    }

    public override string ToString() => Amount.ToString("F2");
}
