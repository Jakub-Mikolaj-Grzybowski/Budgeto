using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Events;

namespace Budgeto.Application.Transactions.Commands.DeleteTransaction;

public record DeleteTransactionCommand(int Id) : IRequest;

internal class DeleteTransactionCommandHandler : IRequestHandler<DeleteTransactionCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteTransactionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Transactions.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.AddDomainEvent(new TransactionDeletedEvent(entity));

        _context.Transactions.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
