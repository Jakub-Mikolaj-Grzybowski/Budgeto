using Budgeto.Application.Transactions.Commands.CreateTransaction;
using Budgeto.Application.Transactions.Commands.UpdateTransaction;
using Budgeto.Application.Transactions.Commands.DeleteTransaction;
using Budgeto.Application.Transactions.Queries.GetTransactions;
using Budgeto.Application.Transactions.Queries.GetTransaction;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class Transactions : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetTransactions);
        groupBuilder.MapGet(GetTransaction, "{id}");
        groupBuilder.MapPost(CreateTransaction);
        groupBuilder.MapPut(UpdateTransaction, "{id}");
        groupBuilder.MapDelete(DeleteTransaction, "{id}");
    }

    public async Task<List<TransactionDto>> GetTransactions(ISender sender, int? month, int? year)
    {
        return await sender.Send(new GetTransactionsQuery { Month = month, Year = year });
    }

    public async Task<TransactionDto> GetTransaction(ISender sender, int id)
    {
        return await sender.Send(new GetTransactionQuery(id));
    }

    public async Task<Created<int>> CreateTransaction(ISender sender, CreateTransactionCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(Transactions)}/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateTransaction(ISender sender, int id, UpdateTransactionCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();
        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<NoContent> DeleteTransaction(ISender sender, int id)
    {
        await sender.Send(new DeleteTransactionCommand(id));
        return TypedResults.NoContent();
    }
}
