namespace Budgeto.Application.Dashboard.Queries.GetDashboardSummary;

public class CategorySummaryDto
{
    public string Category { get; init; } = null!;
    public decimal Amount { get; init; }
    public decimal Percentage { get; init; }
}
