using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.Budgets.Commands.DeleteBudget;

public record DeleteBudgetCommand(int Id) : IRequest;

internal class DeleteBudgetCommandHandler : IRequestHandler<DeleteBudgetCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteBudgetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteBudgetCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Budgets.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.Budgets.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
