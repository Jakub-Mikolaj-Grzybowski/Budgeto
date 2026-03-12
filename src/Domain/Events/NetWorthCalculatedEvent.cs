namespace Budgeto.Domain.Events;

public class NetWorthCalculatedEvent : BaseEvent
{
    public int NetWorthSnapshotId { get; }
    public decimal TotalAssets { get; }
    public decimal TotalLiabilities { get; }
    public decimal NetWorth { get; }

    public NetWorthCalculatedEvent(int snapshotId, decimal totalAssets, decimal totalLiabilities, decimal netWorth)
    {
        NetWorthSnapshotId = snapshotId;
        TotalAssets = totalAssets;
        TotalLiabilities = totalLiabilities;
        NetWorth = netWorth;
    }
}
