using Budgeto.Application.NetWorth.Commands.CreateNetWorthAccount;
using Budgeto.Application.NetWorth.Commands.UpdateNetWorthAccount;
using Budgeto.Application.NetWorth.Commands.DeleteNetWorthAccount;
using Budgeto.Application.NetWorth.Queries.GetNetWorthSummary;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class NetWorth : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetNetWorthSummary);
        groupBuilder.MapPost(CreateNetWorthAccount);
        groupBuilder.MapPut(UpdateNetWorthAccount, "{id}");
        groupBuilder.MapDelete(DeleteNetWorthAccount, "{id}");
    }

    public async Task<NetWorthSummaryDto> GetNetWorthSummary(ISender sender)
    {
        return await sender.Send(new GetNetWorthSummaryQuery());
    }

    public async Task<Created<int>> CreateNetWorthAccount(ISender sender, CreateNetWorthAccountCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(NetWorth)}/{id}", id);
    }

    public async Task<Results<NoContent, NotFound>> UpdateNetWorthAccount(ISender sender, int id, UpdateNetWorthAccountCommand command)
    {
        if (id != command.Id) return TypedResults.NotFound();
        await sender.Send(command);
        return TypedResults.NoContent();
    }

    public async Task<NoContent> DeleteNetWorthAccount(ISender sender, int id)
    {
        await sender.Send(new DeleteNetWorthAccountCommand(id));
        return TypedResults.NoContent();
    }
}
