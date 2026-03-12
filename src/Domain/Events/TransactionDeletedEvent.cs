namespace Budgeto.Domain.Events;

public class TransactionDeletedEvent : BaseEvent
{
    public Transaction Transaction { get; }

    public TransactionDeletedEvent(Transaction transaction)
    {
        Transaction = transaction;
    }
}
