using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.RecurringTransactions.Commands.UpdateRecurringTransaction;

public record UpdateRecurringTransactionCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public int CategoryId { get; init; }
    public RecurrenceFrequency Frequency { get; init; }
    public DateOnly NextDueDate { get; init; }
    public bool IsActive { get; init; }
}

internal class UpdateRecurringTransactionCommandHandler : IRequestHandler<UpdateRecurringTransactionCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateRecurringTransactionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateRecurringTransactionCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.RecurringTransactions.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.Amount = request.Amount;
        entity.CategoryId = request.CategoryId;
        entity.Frequency = request.Frequency;
        entity.NextDueDate = request.NextDueDate;
        entity.IsActive = request.IsActive;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
