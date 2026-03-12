using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;
using NUnit.Framework;
using Shouldly;

namespace Budgeto.Domain.UnitTests.Entities;

public class TransactionTests
{
    [Test]
    public void Transaction_SetProperties_AllPropertiesStored()
    {
        var tx = new Transaction
        {
            Name = "Groceries",
            Amount = 150.50m,
            Date = new DateOnly(2026, 3, 10),
            Type = TransactionType.Expense,
            CategoryId = 5,
            Notes = "Weekly shopping"
        };

        tx.Name.ShouldBe("Groceries");
        tx.Amount.ShouldBe(150.50m);
        tx.Date.ShouldBe(new DateOnly(2026, 3, 10));
        tx.Type.ShouldBe(TransactionType.Expense);
        tx.CategoryId.ShouldBe(5);
        tx.Notes.ShouldBe("Weekly shopping");
    }

    [Test]
    public void Transaction_InheritsBaseEntity_HasIdAndDomainEvents()
    {
        var tx = new Transaction();

        tx.Id.ShouldBe(0);
        tx.DomainEvents.ShouldBeEmpty();
    }

    [Test]
    public void Transaction_IncomeType_ValueIsZero()
    {
        TransactionType.Income.ShouldBe((TransactionType)0);
    }

    [Test]
    public void Transaction_ExpenseType_ValueIsOne()
    {
        TransactionType.Expense.ShouldBe((TransactionType)1);
    }

    [Test]
    public void Transaction_Notes_CanBeNull()
    {
        var tx = new Transaction { Name = "Test", Amount = 10m, Notes = null };

        tx.Notes.ShouldBeNull();
    }
}
