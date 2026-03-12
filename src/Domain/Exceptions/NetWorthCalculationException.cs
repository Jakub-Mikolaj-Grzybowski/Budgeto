namespace Budgeto.Domain.Exceptions;

public class NetWorthCalculationException : Exception
{
    public NetWorthCalculationException(string message) : base(message) { }
}
