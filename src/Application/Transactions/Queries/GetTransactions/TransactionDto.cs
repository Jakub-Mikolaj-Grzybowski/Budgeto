using Budgeto.Domain.Enums;

namespace Budgeto.Application.Transactions.Queries.GetTransactions;

public class TransactionDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public DateOnly Date { get; init; }
    public TransactionType Type { get; init; }
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = null!;
    public string? Notes { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.Transaction, TransactionDto>()
                .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name));
        }
    }
}
