using Budgeto.Domain.Entities;
using NUnit.Framework;
using Shouldly;

namespace Budgeto.Domain.UnitTests.Entities;

public class BudgetTests
{
    [Test]
    public void Budget_SetProperties_AllPropertiesStored()
    {
        var budget = new Budget
        {
            Name = "Food",
            Amount = 2000m,
            WeeklyLimit = 500m,
            CategoryId = 3,
            Month = 3,
            Year = 2026
        };

        budget.Name.ShouldBe("Food");
        budget.Amount.ShouldBe(2000m);
        budget.WeeklyLimit.ShouldBe(500m);
        budget.CategoryId.ShouldBe(3);
        budget.Month.ShouldBe(3);
        budget.Year.ShouldBe(2026);
    }

    [Test]
    public void Budget_InheritsBaseAuditableEntity_HasAuditFields()
    {
        var budget = new Budget();
        var created = new DateTimeOffset(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);

        budget.Created = created;
        budget.CreatedBy = "user1";
        budget.LastModified = created;
        budget.LastModifiedBy = "user2";

        budget.Created.ShouldBe(created);
        budget.CreatedBy.ShouldBe("user1");
        budget.LastModified.ShouldBe(created);
        budget.LastModifiedBy.ShouldBe("user2");
    }

    [Test]
    public void Budget_InheritsBaseEntity_HasIdAndDomainEvents()
    {
        var budget = new Budget();

        budget.Id.ShouldBe(0);
        budget.DomainEvents.ShouldBeEmpty();
    }

    [Test]
    public void Budget_WeeklyLimit_CanBeNull()
    {
        var budget = new Budget { Name = "Test", Amount = 100m, WeeklyLimit = null };

        budget.WeeklyLimit.ShouldBeNull();
    }

    [Test]
    public void Budget_Category_NavigationProperty()
    {
        var category = new Category { Name = "Groceries" };
        var budget = new Budget { Name = "Food", Amount = 1000m, Category = category };

        budget.Category.ShouldBe(category);
        budget.Category.Name.ShouldBe("Groceries");
    }
}
