namespace Budgeto.Domain.Entities;

public class RecurringTransaction : BaseAuditableEntity
{
    public string Name { get; set; } = null!;
    public decimal Amount { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public RecurrenceFrequency Frequency { get; set; }
    public DateOnly NextDueDate { get; set; }
    public bool IsActive { get; set; } = true;
}
