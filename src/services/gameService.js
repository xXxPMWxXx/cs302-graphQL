import axios from 'axios';

export const fetchGames = async () => {
  try {
    const response = await axios.get('http://3.15.201.85:30000/games');
    return response.data.data.games; // Adjusted for axios response structure
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch games data from REST API');
  }
};

export const fetchGameById = async (gameId) => {
  try {
    const response = await axios.get('http://3.15.201.85:30000/games');
    const games = response.data.data.games; // Adjusted for axios response structure
    return games.find(game => game.game_id === Number(gameId));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch the game from REST API');
  }
};