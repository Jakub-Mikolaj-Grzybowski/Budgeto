using Budgeto.Application.Common.Interfaces;
using Budgeto.Domain.Entities;

namespace Budgeto.Application.NetWorth.Commands.CreateNetWorthAccount;

public record CreateNetWorthAccountCommand : IRequest<int>
{
    public string Name { get; init; } = null!;
    public int CategoryId { get; init; }
    public decimal Balance { get; init; }
    public DateOnly? RepaymentDate { get; init; }
}

internal class CreateNetWorthAccountCommandHandler
    : IRequestHandler<CreateNetWorthAccountCommand, int>
{
    private readonly IApplicationDbContext _context;

    public CreateNetWorthAccountCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(
        CreateNetWorthAccountCommand request,
        CancellationToken cancellationToken
    )
    {
        var entity = new NetWorthAccount
        {
            Name = request.Name,
            CategoryId = request.CategoryId,
            Balance = request.Balance,
            RepaymentDate = request.RepaymentDate,
        };

        _context.NetWorthAccounts.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
