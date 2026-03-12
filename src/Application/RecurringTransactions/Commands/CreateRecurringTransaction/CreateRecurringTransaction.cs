using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.RecurringTransactions.Commands.CreateRecurringTransaction;

public record CreateRecurringTransactionCommand : IRequest<int>
{
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public int CategoryId { get; init; }
    public RecurrenceFrequency Frequency { get; init; }
    public DateOnly NextDueDate { get; init; }
}

internal class CreateRecurringTransactionCommandHandler : IRequestHandler<CreateRecurringTransactionCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateRecurringTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var entity = new RecurringTransaction
        {
            Name = request.Name,
            Amount = request.Amount,
            CategoryId = request.CategoryId,
            Frequency = request.Frequency,
            NextDueDate = request.NextDueDate,
            IsActive = true,
        };

        _context.RecurringTransactions.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
