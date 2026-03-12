using MediatR;
using Application.NetWorth.Queries;
using Application.NetWorth.Dtos;

namespace Application.NetWorth.Handlers
{
    public class GetNetWorthQueryHandler : IRequestHandler<GetNetWorthQuery, NetWorthDto>
    {
        public Task<NetWorthDto> Handle(GetNetWorthQuery request, CancellationToken cancellationToken)
        {
            // Przykładowa implementacja zwracająca dane zgodne z oczekiwaniami frontendu
            var dto = new NetWorthDto
            {
                Id = Guid.NewGuid(),
                UserId = request.UserId,
                Value = 12345.67m,
                Date = request.Date,
            };
            return Task.FromResult(dto);
        }
    }
}
