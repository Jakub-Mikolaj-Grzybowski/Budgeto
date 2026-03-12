namespace Budgeto.Application.NetWorth.Queries.GetNetWorthSummary;

public class NetWorthSummaryDto
{
    public List<NetWorthAccountDto> Accounts { get; init; } = new();
    public List<NetWorthSnapshotDto> Snapshots { get; init; } = new();
    public decimal TotalAssets { get; init; }
    public decimal TotalLiabilities { get; init; }
    public decimal NetWorth { get; init; }
}
