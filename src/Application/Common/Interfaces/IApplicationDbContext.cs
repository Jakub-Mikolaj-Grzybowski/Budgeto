using Budgeto.Domain.Entities;

namespace Budgeto.Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Transaction> Transactions { get; }
    DbSet<Budget> Budgets { get; }
    DbSet<Category> Categories { get; }
    DbSet<SavingsGoal> SavingsGoals { get; }
    DbSet<RecurringTransaction> RecurringTransactions { get; }
    DbSet<NetWorthAccount> NetWorthAccounts { get; }
    DbSet<NetWorthSnapshot> NetWorthSnapshots { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
