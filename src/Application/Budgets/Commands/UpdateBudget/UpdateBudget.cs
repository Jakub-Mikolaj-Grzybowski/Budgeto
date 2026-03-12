using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.Budgets.Commands.UpdateBudget;

public record UpdateBudgetCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public decimal Amount { get; init; }
    public decimal? WeeklyLimit { get; init; }
    public int CategoryId { get; init; }
    public int Month { get; init; }
    public int Year { get; init; }
}

internal class UpdateBudgetCommandHandler : IRequestHandler<UpdateBudgetCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateBudgetCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateBudgetCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Budgets.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.Amount = request.Amount;
        entity.WeeklyLimit = request.WeeklyLimit;
        entity.CategoryId = request.CategoryId;
        entity.Month = request.Month;
        entity.Year = request.Year;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
