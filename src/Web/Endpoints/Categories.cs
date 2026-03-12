using Budgeto.Application.Categories.Commands.CreateCategory;
using Budgeto.Application.Categories.Commands.DeleteCategory;
using Budgeto.Application.Categories.Queries.GetCategories;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Budgeto.Web.Endpoints;

public class Categories : EndpointGroupBase
{
    public override void Map(RouteGroupBuilder groupBuilder)
    {
        groupBuilder.MapGet(GetCategories);
        groupBuilder.MapPost(CreateCategory);
        groupBuilder.MapDelete(DeleteCategory, "{id}");
    }

    public async Task<List<CategoryDto>> GetCategories(ISender sender)
    {
        return await sender.Send(new GetCategoriesQuery());
    }

    public async Task<Created<int>> CreateCategory(ISender sender, CreateCategoryCommand command)
    {
        var id = await sender.Send(command);
        return TypedResults.Created($"/{nameof(Categories)}/{id}", id);
    }

    public async Task<NoContent> DeleteCategory(ISender sender, int id)
    {
        await sender.Send(new DeleteCategoryCommand(id));
        return TypedResults.NoContent();
    }
}
