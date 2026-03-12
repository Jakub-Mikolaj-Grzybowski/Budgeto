namespace Budgeto.Application.NetWorth.Queries.GetNetWorthSummary;

public class NetWorthAccountDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = null!;
    public int CategoryType { get; init; }
    public decimal Balance { get; init; }
    public DateOnly? RepaymentDate { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.NetWorthAccount, NetWorthAccountDto>()
                .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name))
                .ForMember(d => d.CategoryType, opt => opt.MapFrom(s => (int)s.Category.Type));
        }
    }
}
