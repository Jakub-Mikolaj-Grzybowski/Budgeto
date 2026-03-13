using Budgeto.Domain.Entities;
using Budgeto.Domain.Enums;
using NUnit.Framework;
using Shouldly;

namespace Budgeto.Domain.UnitTests.Entities;

public class CategoryTests
{
    [Test]
    public void Category_SetProperties_AllPropertiesStored()
    {
        var category = new Category
        {
            Name = "Groceries",
            Icon = "cart",
            Type = TransactionType.Expense
        };

        category.Name.ShouldBe("Groceries");
        category.Icon.ShouldBe("cart");
        category.Type.ShouldBe(TransactionType.Expense);
    }

    [Test]
    public void Category_InheritsBaseEntity_HasIdAndDomainEvents()
    {
        var category = new Category();

        category.Id.ShouldBe(0);
        category.DomainEvents.ShouldBeEmpty();
    }

    [Test]
    public void Category_Icon_CanBeNull()
    {
        var category = new Category { Name = "Test", Icon = null };

        category.Icon.ShouldBeNull();
    }

    [Test]
    public void Category_InheritsBaseAuditableEntity_HasAuditFields()
    {
        var category = new Category();
        var now = DateTimeOffset.UtcNow;

        category.Created = now;
        category.CreatedBy = "admin";

        category.Created.ShouldBe(now);
        category.CreatedBy.ShouldBe("admin");
    }
}
