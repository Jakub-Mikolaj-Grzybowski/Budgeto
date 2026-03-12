namespace Domain.Entities
{
    public class NetWorth
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        // Opcjonalnie: szczegóły kalkulacji
        // public NetWorthCalculationDetails CalculationDetails { get; set; }
    }
}
