namespace Budgeto.Domain.Events;

public class BudgetCreatedEvent : BaseEvent
{
    public Budget Budget { get; }

    public BudgetCreatedEvent(Budget budget)
    {
        Budget = budget;
    }
}
