using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.SavingsGoals.Commands.DeleteSavingsGoal;

public record DeleteSavingsGoalCommand(int Id) : IRequest;

internal class DeleteSavingsGoalCommandHandler : IRequestHandler<DeleteSavingsGoalCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteSavingsGoalCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteSavingsGoalCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.SavingsGoals.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.SavingsGoals.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
