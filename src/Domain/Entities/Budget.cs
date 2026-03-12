namespace Budgeto.Domain.Entities;

public class Budget : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public decimal Amount { get; set; }
    public decimal? WeeklyLimit { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public int Month { get; set; }
    public int Year { get; set; }
}
