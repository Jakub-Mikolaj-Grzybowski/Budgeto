using Budgeto.Application.Dashboard.Queries.GetDashboardSummary;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class Dashboard : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetDashboardSummary);
    }

    public async Task<DashboardSummaryDto> GetDashboardSummary(ISender sender, int month, int year)
    {
        return await sender.Send(new GetDashboardSummaryQuery { Month = month, Year = year });
    }
}
