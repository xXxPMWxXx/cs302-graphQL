export const fetchGames = async () => {
  try {
    const response = await fetch('http://3.15.201.85:30000/games');
    const data = await response.json();
    return data.data.games;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch games data from REST API');
  }
};
  
export const fetchGameById = async (gameId) => {
  try {
    const response = await fetch('http://3.15.201.85:30000/games');
    const data = await response.json();
    const games = data.data.games;
    return games.find(game => game.game_id === Number(gameId));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch the game from REST API');
  }
};