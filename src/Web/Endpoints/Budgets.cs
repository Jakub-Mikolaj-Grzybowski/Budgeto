using Budgeto.Application.Budgets.Commands.CreateBudget;
using Budgeto.Application.Budgets.Commands.UpdateBudget;
using Budgeto.Application.Budgets.Commands.DeleteBudget;
using Budgeto.Application.Budgets.Queries.GetBudgets;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class Budgets : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetBudgets);
        groupBuilder.MapPost(CreateBudget);
        groupBuilder.MapPut(UpdateBudget, "{id}");
        groupBuilder.MapDelete(DeleteBudget, "{id}");
    }

    public async Task<List<BudgetDto>> GetBudgets(ISender sender, int month, int year)
    {
        return await sender.Send(new GetBudgetsQuery { Month = month, Year = year });
    }

    public async Task<Created<int>> CreateBudget(ISender sender, CreateBudgetCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(Budgets)}/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateBudget(ISender sender, int id, UpdateBudgetCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();
        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<NoContent> DeleteBudget(ISender sender, int id)
    {
        await sender.Send(new DeleteBudgetCommand(id));
        return TypedResults.NoContent();
    }
}
