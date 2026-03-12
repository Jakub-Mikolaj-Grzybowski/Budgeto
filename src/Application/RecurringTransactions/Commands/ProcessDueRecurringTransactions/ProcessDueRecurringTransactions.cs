using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.RecurringTransactions.Commands.ProcessDueRecurringTransactions;

public record ProcessDueRecurringTransactionsCommand : IRequest<int>;

internal class ProcessDueRecurringTransactionsCommandHandler : IRequestHandler<ProcessDueRecurringTransactionsCommand, int>
{
    private readonly IApplicationDbContext _context;

    public ProcessDueRecurringTransactionsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(ProcessDueRecurringTransactionsCommand request, CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var dueItems = await _context.RecurringTransactions
            .Where(r => r.IsActive && r.NextDueDate <= today)
            .ToListAsync(cancellationToken);

        var processed = 0;

        foreach (var rec in dueItems)
        {
            // Process all overdue occurrences (may have missed multiple)
            while (rec.NextDueDate <= today)
            {
                _context.Transactions.Add(new Transaction
                {
                    Name = rec.Name,
                    Amount = rec.Amount,
                    Date = rec.NextDueDate,
                    Type = TransactionType.Expense,
                    CategoryId = rec.CategoryId,
                    Notes = "Płatność cykliczna (auto)"
                });

                // Advance next due date
                rec.NextDueDate = rec.Frequency == RecurrenceFrequency.Monthly
                    ? rec.NextDueDate.AddMonths(1)
                    : rec.NextDueDate.AddDays(7);

                processed++;
            }
        }

        if (processed > 0)
        {
            await _context.SaveChangesAsync(cancellationToken);
        }

        return processed;
    }
}
