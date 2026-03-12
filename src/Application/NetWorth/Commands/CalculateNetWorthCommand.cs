using MediatR;
using Application.NetWorth.Dtos;

namespace Application.NetWorth.Commands
{
    public class CalculateNetWorthCommand : IRequest<NetWorthDto>
    {
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
    }
}
