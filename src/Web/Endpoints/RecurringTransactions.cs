using Budgeto.Application.RecurringTransactions.Commands.CreateRecurringTransaction;
using Budgeto.Application.RecurringTransactions.Commands.UpdateRecurringTransaction;
using Budgeto.Application.RecurringTransactions.Commands.DeleteRecurringTransaction;
using Budgeto.Application.RecurringTransactions.Commands.ProcessRecurringTransactions;
using Budgeto.Application.RecurringTransactions.Queries.GetRecurringTransactions;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class RecurringTransactions : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetRecurringTransactions);
        groupBuilder.MapPost(CreateRecurringTransaction);
        groupBuilder.MapPost(ProcessRecurringTransactions, "process");
        groupBuilder.MapPut(UpdateRecurringTransaction, "{id}");
        groupBuilder.MapDelete(DeleteRecurringTransaction, "{id}");
    }

    public async Task<List<RecurringTransactionDto>> GetRecurringTransactions(ISender sender)
    {
        return await sender.Send(new GetRecurringTransactionsQuery());
    }

    public async Task<Created<int>> CreateRecurringTransaction(ISender sender, CreateRecurringTransactionCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(RecurringTransactions)}/{id}", id);
    }

    public async Task<Ok<int>> ProcessRecurringTransactions(ISender sender)
    {
        var count = await sender.Send(new ProcessRecurringTransactionsCommand());
        return TypedResults.Ok(count);
    }

    public async Task<Results<NoContent, NotFound>> UpdateRecurringTransaction(ISender sender, int id, UpdateRecurringTransactionCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();
        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<NoContent> DeleteRecurringTransaction(ISender sender, int id)
    {
        await sender.Send(new DeleteRecurringTransactionCommand(id));
        return TypedResults.NoContent();
    }
}
