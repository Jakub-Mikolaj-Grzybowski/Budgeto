using Budgeto.Domain.Enums;

namespace Budgeto.Application.Categories.Queries.GetCategories;

public class CategoryDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public string? Icon { get; init; }
    public TransactionType Type { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.Category, CategoryDto>();
        }
    }
}
