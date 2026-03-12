using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.Dashboard.Queries;

public class DashboardSummaryDto
{
    public decimal TotalIncome { get; init; }
    public decimal TotalExpenses { get; init; }
    public decimal Balance { get; init; }
    public int TransactionCount { get; init; }
    public List<CategorySummaryDto> TopExpenseCategories { get; init; } = new();
    public List<MonthlyTrendDto> MonthlyTrend { get; init; } = new();
}

public class CategorySummaryDto
{
    public string Category { get; init; } = null!;
    public decimal Amount { get; init; }
    public decimal Percentage { get; init; }
}

public class MonthlyTrendDto
{
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal Income { get; init; }
    public decimal Expenses { get; init; }
}

public record GetDashboardSummaryQuery : IRequest<DashboardSummaryDto>
{
    public int Month { get; init; }
    public int Year { get; init; }
}

internal class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private readonly IApplicationDbContext _context;

    public GetDashboardSummaryQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var monthTransactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.Date.Month == request.Month && t.Date.Year == request.Year)
            .ToListAsync(cancellationToken);

        var totalIncome = monthTransactions
            .Where(t => t.Type == TransactionType.Income)
            .Sum(t => t.Amount);

        var totalExpenses = monthTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);

        var topCategories = monthTransactions
            .Where(t => t.Type == TransactionType.Expense)
            .GroupBy(t => t.Category.Name)
            .Select(g => new CategorySummaryDto
            {
                Category = g.Key,
                Amount = g.Sum(t => t.Amount),
                Percentage = totalExpenses > 0 ? Math.Round(g.Sum(t => t.Amount) / totalExpenses * 100, 1) : 0
            })
            .OrderByDescending(c => c.Amount)
            .Take(5)
            .ToList();

        var sixMonthsAgo = new DateOnly(request.Year, request.Month, 1).AddMonths(-5);
        var monthlyTrend = await _context.Transactions
            .Where(t => t.Date >= sixMonthsAgo)
            .ToListAsync(cancellationToken);

        var trend = monthlyTrend
            .GroupBy(t => new { t.Date.Year, t.Date.Month })
            .Select(g => new MonthlyTrendDto
            {
                Month = g.Key.Month,
                Year = g.Key.Year,
                Income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
                Expenses = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
            })
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .ToList();

        return new DashboardSummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            Balance = totalIncome - totalExpenses,
            TransactionCount = monthTransactions.Count,
            TopExpenseCategories = topCategories,
            MonthlyTrend = trend
        };
    }
}
