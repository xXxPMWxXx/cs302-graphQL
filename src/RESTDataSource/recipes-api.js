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

    // POST
    async createRecipe(recipe) {
        return this.post(
            'recipes', // path
            { body: { recipe } }, // request body
        );
    }

}