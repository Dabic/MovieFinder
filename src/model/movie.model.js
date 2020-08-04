class MovieModel {
    constructor(movieResponse) {
        this.title = movieResponse['Title'];
        this.year = movieResponse['Year'];
        this.genre = this.responseStringToArray(movieResponse['Genre']);
        this.actors = this.responseStringToArray(movieResponse['Actors']);
        this.plot = movieResponse['Plot'];
        this.poster = movieResponse['Poster'];
        this.duration = movieResponse['Runtime'];
        this.id = movieResponse['imdbID']
    }

    responseStringToArray(responseString) {
        const responseArray = responseString.split(',');
        return responseArray.map(element => element.trim());
    }
}

export default MovieModel
