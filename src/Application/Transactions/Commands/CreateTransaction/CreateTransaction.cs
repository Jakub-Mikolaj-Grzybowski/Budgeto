using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.Transactions.Commands.CreateTransaction;

public record CreateTransactionCommand : IRequest<int>
{
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public DateTime Date { get; init; }
    public TransactionType Type { get; init; }
    public int CategoryId { get; init; }
    public string? Notes { get; init; }
}

internal class CreateTransactionCommandHandler : IRequestHandler<CreateTransactionCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateTransactionCommand request, CancellationToken cancellationToken)
    {
        var transaction = new Transaction
        {
            Name = request.Name,
            Amount = request.Amount,
            Date = DateOnly.FromDateTime(request.Date),
            Type = request.Type,
            CategoryId = request.CategoryId,
            Notes = request.Notes,
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
