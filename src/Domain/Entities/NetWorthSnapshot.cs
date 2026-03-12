namespace Budgeto.Domain.Entities;

public class NetWorthSnapshot : BaseAuditableEntity
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal TotalAssets { get; set; }
    public decimal TotalLiabilities { get; set; }
    public decimal NetWorth { get; set; }
}
