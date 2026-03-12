using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.RecurringTransactions.Commands.ProcessRecurringTransactions;

public record ProcessRecurringTransactionsCommand : IRequest<int>;

internal class ProcessRecurringTransactionsCommandHandler : IRequestHandler<ProcessRecurringTransactionsCommand, int>
{
    private readonly IApplicationDbContext _context;

    public ProcessRecurringTransactionsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(ProcessRecurringTransactionsCommand request, CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var due = await _context.RecurringTransactions
            .Where(r => r.IsActive && r.NextDueDate <= today)
            .ToListAsync(cancellationToken);

        foreach (var rec in due)
        {
            // Create transaction for each overdue occurrence, advancing date until it's in the future
            while (rec.NextDueDate <= today)
            {
                _context.Transactions.Add(Transaction.Create(
                    rec.Name,
                    rec.Amount,
                    rec.NextDueDate,
                    TransactionType.Expense,
                    rec.CategoryId,
                    "Płatność cykliczna (auto)"));

                rec.NextDueDate = rec.Frequency == RecurrenceFrequency.Monthly
                    ? rec.NextDueDate.AddMonths(1)
                    : rec.NextDueDate.AddDays(7);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return due.Count;
    }
}
