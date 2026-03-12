using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.SavingsGoals.Queries.GetSavingsGoals;

public record GetSavingsGoalsQuery : IRequest<List<SavingsGoalDto>>;

internal class GetSavingsGoalsQueryHandler : IRequestHandler<GetSavingsGoalsQuery, List<SavingsGoalDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly IMapper _mapper;

    public GetSavingsGoalsQueryHandler(IApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<SavingsGoalDto>> Handle(GetSavingsGoalsQuery request, CancellationToken cancellationToken)
    {
        return await _context.SavingsGoals
            .OrderBy(s => s.Name)
            .ProjectTo<SavingsGoalDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
