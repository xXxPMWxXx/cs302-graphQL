let games = [
    { id: '1', title: 'Game 1', platforms: ['PC', 'Xbox'] },
    { id: '2', title: 'Game 2', platforms: ['PC', 'PlayStation'] },
    //...
];

let reviews = [
    { id: '1', content: 'Great game!', rating: 5, game_id: '1' },
    { id: '2', content: 'Played it a couple of times', rating: 4, game_id: '2', authors_id: '1'},
    {id: '3', content: ' played it a couple of times', rating: 4, game_id: ' 3' ,  authors_id: '2'},
    //...
];

let authors = [
    { id: '1', name: 'John Doe', verified: true },
    { id: '2', name: 'Jane Smith', verified: false },
    //...
];

export default {games, reviews, authors}