namespace Budgeto.Domain.Events;

public class TransactionCreatedEvent : BaseEvent
{
    public Transaction Transaction { get; }

    public TransactionCreatedEvent(Transaction transaction)
    {
        Transaction = transaction;
    }
}
