using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.NetWorth.Queries.GetNetWorthSummary;

public record GetNetWorthSummaryQuery : IRequest<NetWorthSummaryDto>;

internal class GetNetWorthSummaryQueryHandler
    : IRequestHandler<GetNetWorthSummaryQuery, NetWorthSummaryDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetNetWorthSummaryQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<NetWorthSummaryDto> Handle(
        GetNetWorthSummaryQuery request,
        CancellationToken cancellationToken
    )
    {
        var accounts = await _context
            .NetWorthAccounts.Include(a => a.Category)
            .OrderBy(a => a.Category.Type)
            .ThenBy(a => a.Name)
            .ToListAsync(cancellationToken);

        var totalAssets = accounts
            .Where(a => a.Category.Type == TransactionType.Asset)
            .Sum(a => a.Balance);
        var totalLiabilities = accounts
            .Where(a => a.Category.Type == TransactionType.Liability)
            .Sum(a => a.Balance);
        var netWorth = totalAssets - totalLiabilities;

        // Lazy auto-snapshot: create snapshot for current month if missing
        var now = DateTime.UtcNow;
        var currentMonth = now.Month;
        var currentYear = now.Year;

        var existingSnapshot = await _context.NetWorthSnapshots.FirstOrDefaultAsync(
            s => s.Month == currentMonth && s.Year == currentYear,
            cancellationToken
        );

        if (existingSnapshot == null)
        {
            _context.NetWorthSnapshots.Add(
                new NetWorthSnapshot
                {
                    Month = currentMonth,
                    Year = currentYear,
                    TotalAssets = totalAssets,
                    TotalLiabilities = totalLiabilities,
                    NetWorth = netWorth,
                }
            );
            await _context.SaveChangesAsync(cancellationToken);
        }
        else
        {
            existingSnapshot.TotalAssets = totalAssets;
            existingSnapshot.TotalLiabilities = totalLiabilities;
            existingSnapshot.NetWorth = netWorth;
            await _context.SaveChangesAsync(cancellationToken);
        }

        var snapshots = await _context
            .NetWorthSnapshots.OrderBy(s => s.Year)
            .ThenBy(s => s.Month)
            .ProjectTo<NetWorthSnapshotDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return new NetWorthSummaryDto
        {
            Accounts = _mapper.Map<List<NetWorthAccountDto>>(accounts),
            Snapshots = snapshots,
            TotalAssets = totalAssets,
            TotalLiabilities = totalLiabilities,
            NetWorth = netWorth,
        };
    }
}
