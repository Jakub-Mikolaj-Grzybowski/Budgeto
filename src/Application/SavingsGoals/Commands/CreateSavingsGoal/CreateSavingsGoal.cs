using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;

namespace Budgeto.Application.SavingsGoals.Commands.CreateSavingsGoal;

public record CreateSavingsGoalCommand : IRequest<int>
{
    public string Name { get; init; } = null!;
    public decimal TargetAmount { get; init; }
    public decimal CurrentAmount { get; init; }
    public DateOnly? Deadline { get; init; }
}

internal class CreateSavingsGoalCommandHandler : IRequestHandler<CreateSavingsGoalCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateSavingsGoalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateSavingsGoalCommand request, CancellationToken cancellationToken)
    {
        var entity = new SavingsGoal
        {
            Name = request.Name,
            TargetAmount = request.TargetAmount,
            CurrentAmount = request.CurrentAmount,
            Deadline = request.Deadline,
        };

        _context.SavingsGoals.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
