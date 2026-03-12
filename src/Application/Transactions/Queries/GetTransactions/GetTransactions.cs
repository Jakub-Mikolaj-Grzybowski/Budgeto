using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.Transactions.Queries.GetTransactions;

public record GetTransactionsQuery : IRequest<List<TransactionDto>>
{
    public int? Month { get; init; }
    public int? Year { get; init; }
}

internal class GetTransactionsQueryHandler : IRequestHandler<GetTransactionsQuery, List<TransactionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetTransactionsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<TransactionDto>> Handle(GetTransactionsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Transactions.AsQueryable();

        if (request.Month.HasValue && request.Year.HasValue)
        {
            query = query.Where(t => t.Date.Month == request.Month.Value && t.Date.Year == request.Year.Value);
        }

        return await query
            .OrderByDescending(t => t.Date)
            .ProjectTo<TransactionDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
