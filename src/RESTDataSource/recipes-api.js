import { RESTDataSource } from '@apollo/datasource-rest';

export class RecipesAPI extends RESTDataSource {
    baseURL = `${process.env.RECIPE_URL}/`;
    
    async getRecipe(_id) {
        return this.get(`recipes/${encodeURIComponent(_id)}`);
    }
    async getRecipes() {
        const data = await this.get('recipes');
        return data.recipes;
    }

    async getRecipesByAuthor(auther) {
        const data = await this.get(`recipes/author/${encodeURIComponent(auther)}`);
        return data.recipes;
    }

}