using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.RecurringTransactions.Queries.GetRecurringTransactions;

public record GetRecurringTransactionsQuery : IRequest<List<RecurringTransactionDto>>;

internal class GetRecurringTransactionsQueryHandler : IRequestHandler<GetRecurringTransactionsQuery, List<RecurringTransactionDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetRecurringTransactionsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<RecurringTransactionDto>> Handle(GetRecurringTransactionsQuery request, CancellationToken cancellationToken)
    {
        return await _context.RecurringTransactions
            .Where(r => r.IsActive)
            .OrderBy(r => r.NextDueDate)
            .ProjectTo<RecurringTransactionDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
