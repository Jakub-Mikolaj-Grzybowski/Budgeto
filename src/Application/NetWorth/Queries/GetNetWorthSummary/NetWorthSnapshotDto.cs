namespace Budgeto.Application.NetWorth.Queries.GetNetWorthSummary;

public class NetWorthSnapshotDto
{
    public int Id { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal TotalAssets { get; init; }
    public decimal TotalLiabilities { get; init; }
    public decimal NetWorth { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.NetWorthSnapshot, NetWorthSnapshotDto>();
        }
    }
}
