using Budgeto.Domain.Events;
using Microsoft.Extensions.Logging;

namespace Budgeto.Application.Transactions.EventHandlers;

internal class TransactionCreatedEventHandler : INotificationHandler<TransactionCreatedEvent>
{
    private readonly ILogger<TransactionCreatedEventHandler> _logger;

    public TransactionCreatedEventHandler(ILogger<TransactionCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(TransactionCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Domain Event: Transaction created -- Id: {Id}, Name: {Name}, Amount: {Amount}, Category: {CategoryId}",
            notification.Transaction.Id,
            notification.Transaction.Name,
            notification.Transaction.Amount,
            notification.Transaction.CategoryId);

        return Task.CompletedTask;
    }
}
