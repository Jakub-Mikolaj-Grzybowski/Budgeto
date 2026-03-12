using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.NetWorth.Commands.UpdateNetWorthAccount;

public record UpdateNetWorthAccountCommand : IRequest
{
    public int Id { get; init; }
    public string Name { get; init; } = null!;
    public int CategoryId { get; init; }
    public decimal Balance { get; init; }
    public DateOnly? RepaymentDate { get; init; }
}

internal class UpdateNetWorthAccountCommandHandler : IRequestHandler<UpdateNetWorthAccountCommand>
{
    private readonly IApplicationDbContext _context;

    public UpdateNetWorthAccountCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(UpdateNetWorthAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.NetWorthAccounts.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        entity.Name = request.Name;
        entity.CategoryId = request.CategoryId;
        entity.Balance = request.Balance;
        entity.RepaymentDate = request.RepaymentDate;

        await _context.SaveChangesAsync(cancellationToken);
    }
}
