using Budgeto.Application.SavingsGoals.Commands.CreateSavingsGoal;
using Budgeto.Application.SavingsGoals.Commands.UpdateSavingsGoal;
using Budgeto.Application.SavingsGoals.Commands.DeleteSavingsGoal;
using Budgeto.Application.SavingsGoals.Queries.GetSavingsGoals;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class SavingsGoals : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetSavingsGoals);
        groupBuilder.MapPost(CreateSavingsGoal);
        groupBuilder.MapPut(UpdateSavingsGoal, "{id}");
        groupBuilder.MapDelete(DeleteSavingsGoal, "{id}");
    }

    public async Task<List<SavingsGoalDto>> GetSavingsGoals(ISender sender)
    {
        return await sender.Send(new GetSavingsGoalsQuery());
    }

    public async Task<Created<int>> CreateSavingsGoal(ISender sender, CreateSavingsGoalCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(SavingsGoals)}/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateSavingsGoal(ISender sender, int id, UpdateSavingsGoalCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();
        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<NoContent> DeleteSavingsGoal(ISender sender, int id)
    {
        await sender.Send(new DeleteSavingsGoalCommand(id));
        return TypedResults.NoContent();
    }
}
