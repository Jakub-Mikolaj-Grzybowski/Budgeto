namespace Domain.Events
{
    public class NetWorthCalculatedEvent
    {
        public Guid NetWorthId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public decimal Value { get; set; }
    }
}
