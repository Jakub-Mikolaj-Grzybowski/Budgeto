using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.RecurringTransactions.Commands.DeleteRecurringTransaction;

public record DeleteRecurringTransactionCommand(int Id) : IRequest;

internal class DeleteRecurringTransactionCommandHandler : IRequestHandler<DeleteRecurringTransactionCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteRecurringTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.RecurringTransactions.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.RecurringTransactions.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
