using Budgeto.Domain.Enums;

namespace Budgeto.Application.RecurringTransactions.Queries.GetRecurringTransactions;

public class RecurringTransactionDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = null!;
    public RecurrenceFrequency Frequency { get; init; }
    public DateOnly NextDueDate { get; init; }
    public bool IsActive { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.RecurringTransaction, RecurringTransactionDto>()
                .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name));
        }
    }
}
