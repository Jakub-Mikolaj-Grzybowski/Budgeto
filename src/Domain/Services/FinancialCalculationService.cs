namespace Budgeto.Domain.Services;

public static class FinancialCalculationService
{
    public static decimal CalculateTotalByType(IEnumerable<Transaction> transactions, TransactionType type)
        => transactions.Where(t => t.Type == type).Sum(t => t.Amount);

    public static decimal CalculateBalance(decimal income, decimal expenses)
        => income - expenses;

    public static IReadOnlyList<CategorySpending> CalculateTopCategorySpending(
        IEnumerable<Transaction> transactions, int topCount = 5)
    {
        var expenses = transactions.Where(t => t.Type == TransactionType.Expense).ToList();
        var totalExpenses = expenses.Sum(t => t.Amount);

        return expenses
            .GroupBy(t => t.Category?.Name ?? "Unknown")
            .Select(g => new CategorySpending(
                CategoryName: g.Key,
                Amount: g.Sum(t => t.Amount),
                Percentage: totalExpenses > 0
                    ? Math.Round(g.Sum(t => t.Amount) / totalExpenses * 100, 1)
                    : 0))
            .OrderByDescending(c => c.Amount)
            .Take(topCount)
            .ToList();
    }

    public static decimal CalculateSpentForCategory(
        IEnumerable<Transaction> transactions, int categoryId)
        => transactions
            .Where(t => t.CategoryId == categoryId && t.Type == TransactionType.Expense)
            .Sum(t => t.Amount);
}

public record CategorySpending(string CategoryName, decimal Amount, decimal Percentage);
