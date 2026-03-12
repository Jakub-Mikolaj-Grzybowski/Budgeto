using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Enums;

namespace Budgeto.Application.Budgets.Queries.GetBudgets;

public record GetBudgetsQuery : IRequest<List<BudgetDto>>
{
    public int Month { get; init; }
    public int Year { get; init; }
}

internal class GetBudgetsQueryHandler : IRequestHandler<GetBudgetsQuery, List<BudgetDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetBudgetsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<BudgetDto>> Handle(GetBudgetsQuery request, CancellationToken cancellationToken)
    {
        var budgets = await _context.Budgets
            .Where(b => b.Month == request.Month && b.Year == request.Year)
            .ProjectTo<BudgetDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        var transactions = await _context.Transactions
            .Where(t => t.Date.Month == request.Month && t.Date.Year == request.Year && t.Type == TransactionType.Expense)
            .ToListAsync(cancellationToken);

        for (var i = 0; i < budgets.Count; i++)
        {
            budgets[i].Spent = transactions
                .Where(t => t.CategoryId == budgets[i].CategoryId)
                .Sum(t => t.Amount);
        }

        return budgets;
    }
}
