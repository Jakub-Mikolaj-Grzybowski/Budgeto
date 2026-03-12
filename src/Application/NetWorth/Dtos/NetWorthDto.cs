namespace Application.NetWorth.Dtos
{
    public class NetWorthDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        // public NetWorthCalculationDetailsDto? CalculationDetails { get; set; }
    }
}
