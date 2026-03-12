using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.SavingsGoals.Commands.UpdateSavingsGoal;

public record UpdateSavingsGoalCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal TargetAmount { get; init; }
    public decimal CurrentAmount { get; init; }
    public DateOnly? Deadline { get; init; }
}

internal class UpdateSavingsGoalCommandHandler : IRequestHandler<UpdateSavingsGoalCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateSavingsGoalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateSavingsGoalCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.SavingsGoals.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.TargetAmount = request.TargetAmount;
        entity.CurrentAmount = request.CurrentAmount;
        entity.Deadline = request.Deadline;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
