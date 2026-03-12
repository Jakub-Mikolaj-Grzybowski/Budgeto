using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Enums;
using Budgeto.Domain.Services;

namespace Budgeto.Application.Dashboard.Queries.GetDashboardSummary;

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

        var totalIncome = FinancialCalculationService.CalculateTotalByType(monthTransactions, TransactionType.Income);
        var totalExpenses = FinancialCalculationService.CalculateTotalByType(monthTransactions, TransactionType.Expense);
        var topCategories = FinancialCalculationService.CalculateTopCategorySpending(monthTransactions);

        var sixMonthsAgo = new DateOnly(request.Year, request.Month, 1).AddMonths(-5);
        var trendTransactions = await _context.Transactions
            .Where(t => t.Date >= sixMonthsAgo)
            .ToListAsync(cancellationToken);

        var trend = trendTransactions
            .GroupBy(t => new { t.Date.Year, t.Date.Month })
            .Select(g => new MonthlyTrendDto
            {
                Month = g.Key.Month,
                Year = g.Key.Year,
                Income = FinancialCalculationService.CalculateTotalByType(g, TransactionType.Income),
                Expenses = FinancialCalculationService.CalculateTotalByType(g, TransactionType.Expense),
            })
            .OrderBy(m => m.Year)
            .ThenBy(m => m.Month)
            .ToList();

        return new DashboardSummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            Balance = FinancialCalculationService.CalculateBalance(totalIncome, totalExpenses),
            TransactionCount = monthTransactions.Count,
            TopExpenseCategories = topCategories.Select(c => new CategorySummaryDto
            {
                Category = c.CategoryName,
                Amount = c.Amount,
                Percentage = c.Percentage,
            }).ToList(),
            MonthlyTrend = trend,
        };
    }
}
