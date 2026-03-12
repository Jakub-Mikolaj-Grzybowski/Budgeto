using Budgeto.Domain.Events;
using Microsoft.Extensions.Logging;

namespace Budgeto.Application.Transactions.EventHandlers;

internal class TransactionDeletedEventHandler : INotificationHandler<TransactionDeletedEvent>
{
    private readonly ILogger<TransactionDeletedEventHandler> _logger;

    public TransactionDeletedEventHandler(ILogger<TransactionDeletedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(TransactionDeletedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Domain Event: Transaction deleted -- Id: {Id}, Name: {Name}, Amount: {Amount}",
            notification.Transaction.Id,
            notification.Transaction.Name,
            notification.Transaction.Amount);

        return Task.CompletedTask;
    }
}
