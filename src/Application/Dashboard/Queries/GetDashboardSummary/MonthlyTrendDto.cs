namespace Budgeto.Application.Dashboard.Queries.GetDashboardSummary;

public class MonthlyTrendDto
{
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal Income { get; init; }
    public decimal Expenses { get; init; }
}
