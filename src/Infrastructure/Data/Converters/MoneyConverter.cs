using Budgeto.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Budgeto.Infrastructure.Data.Converters;

public class MoneyConverter : ValueConverter<Money, decimal>
{
    public MoneyConverter() : base(
        money => money.Amount,
        value => Money.Of(value))
    { }
}

public class NullableMoneyConverter : ValueConverter<Money?, decimal?>
{
    public NullableMoneyConverter() : base(
        money => money == null ? null : money.Amount,
        value => value.HasValue ? Money.Of(value.Value) : null)
    { }
}
