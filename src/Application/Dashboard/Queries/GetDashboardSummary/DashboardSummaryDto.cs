namespace Budgeto.Application.Dashboard.Queries.GetDashboardSummary;

public class DashboardSummaryDto
{
    public decimal TotalIncome { get; init; }
    public decimal TotalExpenses { get; init; }
    public decimal Balance { get; init; }
    public int TransactionCount { get; init; }
    public List<CategorySummaryDto> TopExpenseCategories { get; init; } = new();
    public List<MonthlyTrendDto> MonthlyTrend { get; init; } = new();
}
