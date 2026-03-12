using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;

namespace Budgeto.Application.Budgets.Commands.CreateBudget;

public record CreateBudgetCommand : IRequest<int>
{
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public decimal? WeeklyLimit { get; init; }
    public int CategoryId { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
}

internal class CreateBudgetCommandHandler : IRequestHandler<CreateBudgetCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateBudgetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateBudgetCommand request, CancellationToken cancellationToken)
    {
        var budget = new Budget
        {
            Name = request.Name,
            Amount = request.Amount,
            WeeklyLimit = request.WeeklyLimit,
            CategoryId = request.CategoryId,
            Month = request.Month,
            Year = request.Year,
        };

        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync(cancellationToken);

        return budget.Id;
    }
}
