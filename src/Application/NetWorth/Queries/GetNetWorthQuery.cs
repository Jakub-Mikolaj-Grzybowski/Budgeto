using MediatR;
using Application.NetWorth.Dtos;

namespace Application.NetWorth.Queries
{
    public class GetNetWorthQuery : IRequest<NetWorthDto>
    {
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
    }
}
