namespace Budgeto.Application.RecurringTransactions.Commands.CreateRecurringTransaction;

public class CreateRecurringTransactionCommandValidator : AbstractValidator<CreateRecurringTransactionCommand>
{
    public CreateRecurringTransactionCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.Frequency).IsInEnum();
    }
}
