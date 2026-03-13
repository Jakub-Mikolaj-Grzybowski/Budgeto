using Budgeto.Domain.Common;
using NUnit.Framework;
using Shouldly;

namespace Budgeto.Domain.UnitTests.Common;

public class BaseEntityTests
{
    private class TestEvent : BaseEvent { }

    private class TestEntity : BaseEntity { }

    [Test]
    public void AddDomainEvent_AddsEventToCollection()
    {
        var entity = new TestEntity();
        var evt = new TestEvent();

        entity.AddDomainEvent(evt);

        entity.DomainEvents.Count.ShouldBe(1);
        entity.DomainEvents.ShouldContain(evt);
    }

    [Test]
    public void AddDomainEvent_MultipleEvents_AllAdded()
    {
        var entity = new TestEntity();
        var evt1 = new TestEvent();
        var evt2 = new TestEvent();

        entity.AddDomainEvent(evt1);
        entity.AddDomainEvent(evt2);

        entity.DomainEvents.Count.ShouldBe(2);
    }

    [Test]
    public void RemoveDomainEvent_RemovesSpecificEvent()
    {
        var entity = new TestEntity();
        var evt1 = new TestEvent();
        var evt2 = new TestEvent();
        entity.AddDomainEvent(evt1);
        entity.AddDomainEvent(evt2);

        entity.RemoveDomainEvent(evt1);

        entity.DomainEvents.Count.ShouldBe(1);
        entity.DomainEvents.ShouldContain(evt2);
    }

    [Test]
    public void ClearDomainEvents_RemovesAll()
    {
        var entity = new TestEntity();
        entity.AddDomainEvent(new TestEvent());
        entity.AddDomainEvent(new TestEvent());
        entity.AddDomainEvent(new TestEvent());

        entity.ClearDomainEvents();

        entity.DomainEvents.ShouldBeEmpty();
    }

    [Test]
    public void DomainEvents_InitiallyEmpty()
    {
        var entity = new TestEntity();

        entity.DomainEvents.ShouldBeEmpty();
    }
}
