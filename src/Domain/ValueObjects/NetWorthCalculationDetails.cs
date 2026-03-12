namespace Budgeto.Domain.ValueObjects;

public class NetWorthCalculationDetails : ValueObject
{
    public decimal TotalAssets { get; private set; }
    public decimal TotalLiabilities { get; private set; }
    public string? Notes { get; private set; }

    private NetWorthCalculationDetails() { }

    public NetWorthCalculationDetails(decimal totalAssets, decimal totalLiabilities, string? notes = null)
    {
        TotalAssets = totalAssets;
        TotalLiabilities = totalLiabilities;
        Notes = notes;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return TotalAssets;
        yield return TotalLiabilities;
        yield return Notes ?? string.Empty;
    }
}
