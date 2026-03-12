using MediatR;
using Application.NetWorth.Commands;
using Application.NetWorth.Dtos;

namespace Application.NetWorth.Handlers
{
    public class CalculateNetWorthCommandHandler : IRequestHandler<CalculateNetWorthCommand, NetWorthDto>
    {
        public Task<NetWorthDto> Handle(CalculateNetWorthCommand request, CancellationToken cancellationToken)
        {
            // Przykładowa implementacja demo
            var dto = new NetWorthDto
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                Value = 10000.00m,
                Date = request.Date,
            };
            return Task.FromResult(dto);
        }
    }
}
