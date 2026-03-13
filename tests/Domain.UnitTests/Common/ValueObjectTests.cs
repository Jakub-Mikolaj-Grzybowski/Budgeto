using Budgeto.Domain.Common;
using NUnit.Framework;
using Shouldly;

namespace Budgeto.Domain.UnitTests.Common;

public class ValueObjectTests
{
    private class TestValueObject : ValueObject
    {
        public string Street { get; }
        public string City { get; }

        public TestValueObject(string street, string city)
        {
            Street = street;
            City = city;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Street;
            yield return City;
        }
    }

    [Test]
    public void Equals_SameComponents_ReturnsTrue()
    {
        var a = new TestValueObject("Main St", "Warsaw");
        var b = new TestValueObject("Main St", "Warsaw");

        a.Equals(b).ShouldBeTrue();
    }

    [Test]
    public void Equals_DifferentComponents_ReturnsFalse()
    {
        var a = new TestValueObject("Main St", "Warsaw");
        var b = new TestValueObject("Main St", "Krakow");

        a.Equals(b).ShouldBeFalse();
    }

    [Test]
    public void Equals_Null_ReturnsFalse()
    {
        var a = new TestValueObject("Main St", "Warsaw");

        a.Equals(null).ShouldBeFalse();
    }

    [Test]
    public void GetHashCode_SameComponents_SameHash()
    {
        var a = new TestValueObject("Main St", "Warsaw");
        var b = new TestValueObject("Main St", "Warsaw");

        a.GetHashCode().ShouldBe(b.GetHashCode());
    }

    [Test]
    public void GetHashCode_DifferentComponents_DifferentHash()
    {
        var a = new TestValueObject("Main St", "Warsaw");
        var b = new TestValueObject("Main St", "Krakow");

        a.GetHashCode().ShouldNotBe(b.GetHashCode());
    }
}
