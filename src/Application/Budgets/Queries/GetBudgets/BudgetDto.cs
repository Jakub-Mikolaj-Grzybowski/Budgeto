namespace Budgeto.Application.Budgets.Queries.GetBudgets;

public class BudgetDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public decimal? WeeklyLimit { get; init; }
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = null!;
    public int Month { get; init; }
    public int Year { get; init; }
    public decimal Spent { get; set; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.Budget, BudgetDto>()
                .ForMember(d => d.Amount, opt => opt.MapFrom(s => s.Amount.Amount))
                .ForMember(d => d.WeeklyLimit, opt => opt.MapFrom(s => s.WeeklyLimit != null ? s.WeeklyLimit.Amount : (decimal?)null))
                .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name))
                .ForMember(d => d.Spent, opt => opt.Ignore());
        }
    }
}
