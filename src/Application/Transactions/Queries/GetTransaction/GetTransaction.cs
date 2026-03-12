using Budgeto.Application.Common.Interfaces;
using Budgeto.Application.Transactions.Queries.GetTransactions;

namespace Budgeto.Application.Transactions.Queries.GetTransaction;

public record GetTransactionQuery(int Id) : IRequest<TransactionDto>;

internal class GetTransactionQueryHandler : IRequestHandler<GetTransactionQuery, TransactionDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTransactionQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<TransactionDto> Handle(GetTransactionQuery request, CancellationToken cancellationToken)
    {
        var entity = await _context.Transactions
            .Where(t => t.Id == request.Id)
            .ProjectTo<TransactionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        return entity;
    }
}
