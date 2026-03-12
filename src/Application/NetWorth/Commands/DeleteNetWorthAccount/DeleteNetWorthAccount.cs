using Budgeto.Application.Common.Interfaces;

namespace Budgeto.Application.NetWorth.Commands.DeleteNetWorthAccount;

public record DeleteNetWorthAccountCommand(int Id) : IRequest;

internal class DeleteNetWorthAccountCommandHandler : IRequestHandler<DeleteNetWorthAccountCommand>
{
    private readonly IApplicationDbContext _context;

    public DeleteNetWorthAccountCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task Handle(DeleteNetWorthAccountCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.NetWorthAccounts.FindAsync(new object[] { request.Id }, cancellationToken);

        Guard.Against.NotFound(request.Id, entity);

        _context.NetWorthAccounts.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
