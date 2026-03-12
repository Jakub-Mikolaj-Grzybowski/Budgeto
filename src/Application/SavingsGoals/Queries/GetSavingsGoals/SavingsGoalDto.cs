namespace Budgeto.Application.SavingsGoals.Queries.GetSavingsGoals;

public class SavingsGoalDto
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal TargetAmount { get; init; }
    public decimal CurrentAmount { get; init; }
    public DateOnly? Deadline { get; init; }

    private class Mapping : Profile
    {
        public Mapping()
        {
            CreateMap<Domain.Entities.SavingsGoal, SavingsGoalDto>();
        }
    }
}
