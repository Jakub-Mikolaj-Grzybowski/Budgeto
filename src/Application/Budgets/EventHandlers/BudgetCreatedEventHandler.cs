using Budgeto.Domain.Events;
using Microsoft.Extensions.Logging;

namespace Budgeto.Application.Budgets.EventHandlers;

internal class BudgetCreatedEventHandler : INotificationHandler<BudgetCreatedEvent>
{
    private readonly ILogger<BudgetCreatedEventHandler> _logger;

    public BudgetCreatedEventHandler(ILogger<BudgetCreatedEventHandler> logger)
    {
        _logger = logger;
    }

    public Task Handle(BudgetCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Domain Event: Budget created -- Id: {Id}, Name: {Name}, Amount: {Amount}, Category: {CategoryId}",
            notification.Budget.Id,
            notification.Budget.Name,
            notification.Budget.Amount,
            notification.Budget.CategoryId);

        return Task.CompletedTask;
    }
}
