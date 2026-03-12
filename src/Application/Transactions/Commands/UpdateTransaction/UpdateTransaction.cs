using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.Transactions.Commands.UpdateTransaction;

public record UpdateTransactionCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public DateTime Date { get; init; }
    public TransactionType Type { get; init; }
    public int CategoryId { get; init; }
    public string? Notes { get; init; }
}

internal class UpdateTransactionCommandHandler : IRequestHandler<UpdateTransactionCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateTransactionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Transactions.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Update(
            request.Name,
            request.Amount,
            DateOnly.FromDateTime(request.Date),
            request.Type,
            request.CategoryId,
            request.Notes);

        await _context.SaveChangesAsync(cancellationToken);
    }
}
