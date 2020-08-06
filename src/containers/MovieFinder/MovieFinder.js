/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import classes from './MovieFinder.module.css'
import axios from 'axios';
import controlsConf from "../../components/SortingControls/controlsConf";

import MovieFinderForm from "../../components/MovieFinderForm/MovieFinderForm";
import SortingControls from "../../components/SortingControls/SortingControls";
import MovieModel from "../../model/movie.model";
import MovieCard from "../../components/MovieCard/MovieCard";
import Spinner from "../../components/UI/Spinner/Spinner";

/**
 * @author Vladimir Dabic
 * @returns MovieFinder component
 * @description Renders the MovieFinder component which contains the main content of the website. It covers the functionality of
 * MovieFinderForm component, SortingControls component and viewing of movies.
 */
const MovieFinder = () => {

    const [movies, setMovies] = useState([]);
    const [sortingControls, setSortingControls] = useState(controlsConf);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('Movie not found!')

    /**
     * @author Vladimir Dabic
     * @description When component is mounted, fetch the movies, with 'Bad Boys' title, from the API.
     */
    useEffect(() => {
        onFindMovies('Bad Boys');
    }, [])

    /**
     * @author Vladimir Dabic
     * @param response
     * @returns {Promise<[]>}
     * @description The used API does not fetch full-detailed information about movies when fetching based on a substring of title parameter.
     * To get the detailed information about each movie, we have to send a request for each movie we get when fetching with a title substring.
     * This lowers the performance of the app and it could be resolved by implementing server-side code that caches the movie in memory
     * every time the new movie is being fetched from the API.
     * This function returns an array as promise so the app state can wait while movie fetching is still running.
     * All fetched movies that doesn't have all of the information will be disposed.
     */
    async function getDetailedMovies(response) {
        const detailedMovies = [];
        try {
            for (const movie of response.data['Search']) {
                await axios.get(`http://www.omdbapi.com/?apikey=2ed3a9a0&t=${encodeURIComponent(movie.Title)}&y=${movie.Year}`)
                    .then(detailResponse => {
                        if (detailResponse.data.Plot !== 'N/A' &&
                            detailResponse.data.Poster !== 'N/A' &&
                            detailResponse.data.Actors !== 'N/A' &&
                            detailResponse.data.Genre !== 'N/A' &&
                            detailResponse.data.Year !== 'N/A') {
                            detailedMovies.push(new MovieModel(detailResponse.data));
                        }
                    }).catch(error => {
                        console.log('not found!')
                    })
            }
        } catch (e) {
            setError(response.data['Error']);
        }
        return detailedMovies;
    }

    /**
     * @author Vladimir Dabic
     * @param controlId
     * @description Handles the SortingControls functionality based on clicked SortingControl.
     */
    const controlOnClick = (controlId) => {
        const updatedSortingControls = {...sortingControls};
        if (sortingControls[controlId].active) {
            const updatedControl = {...updatedSortingControls[controlId]};
            updatedControl.mode = updatedControl.mode === 'ascending' ? 'descending' : 'ascending';
            updatedSortingControls[controlId] = updatedControl;
            setSortingControls(updatedSortingControls);
            setMovies(sortMovies(controlId, updatedControl.mode, movies));
            return;
        }
        for (let control in sortingControls) {
            updatedSortingControls[control].active = false;
        }
        const updatedControl = {...updatedSortingControls[controlId]};
        updatedControl.active = true;
        updatedSortingControls[controlId] = updatedControl;
        setMovies(sortMovies(controlId, sortingControls[controlId].mode, movies));
        setSortingControls(updatedSortingControls);
    }

    /**
     * @author Vladimir Dabic
     * @param title
     * @param year
     * @param genre
     * @param actors
     * @param plot
     * @description Fetch movies based on the given parameters. Title parameter is required, while the year parameter is optional.
     */
    const onFindMovies = (title, year = '', genre = '', actors = '', plot = '') => {
        setLoading(true);
        setMovies([]);
        axios.get(`http://www.omdbapi.com/?apikey=2ed3a9a0&s=${encodeURIComponent(title)}&y=${year}`)
            .then(response => {
                getDetailedMovies(response).then(r => {
                    setMovies(sortMovies('title', 'ascending', filterMoviesByParams(r, genre, actors, plot)));
                    setLoading(false);
                });
            })
    };

    /**
     * @author Vladimir Dabic
     * @param movies: MovieModel[]
     * @param genre: string[]
     * @param actors: string[]
     * @param plot: string
     * @returns {MovieModel[]}
     * @description The function filters fetched movies from the API based on clients parameters (genre, actors and plot).
     */
    const filterMoviesByParams = (movies, genre, actors, plot) => {
        let filteredMovies = [...movies];
        if (genre !== '') {
            filteredMovies = filteredMovies.filter(movie => movie.genre.filter(gnr => gnr.toLowerCase() === genre.toLowerCase()).length > 0);
        }
        if (actors.length > 0) {
            let actorsArray = actors.split(',');
            filteredMovies = filteredMovies.filter(movie => {
                for (let actor of actorsArray) {
                    if (movie.actors.filter(actr => actr === actor.trim()).length === 0) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (plot !== '') {
            filteredMovies = filteredMovies.filter(movie => movie.plot.toLowerCase().startsWith(plot.toLowerCase()));
        }
        return filteredMovies;
    }

    /**
     * @author Vladimir Dabic
     * @param movieA: MovieModel
     * @param movieB: MovieModel
     * @param field: string
     * @param condition: string
     * @returns {number}
     * @description Comparator used for sorting movies.
     */
    const sortingComparator = (movieA, movieB, field, condition) => {
        if (condition === 'descending') {
            if (movieA[field] < movieB[field]) {
                return field === 'year' ? 1 : -1;
            }
            if (movieA[field] > movieB[field]) {
                return field === 'year' ? -1 : 1;
            }
            return 0;
        } else {
            if (movieA[field] < movieB[field]) {
                return field === 'year' ? -1 : 1;
            }
            if (movieA[field] > movieB[field]) {
                return field === 'year' ? 1 : -1;
            }
            return 0;
        }
    }

    /**
     * @author Vladimir Dabic
     * @param id: string
     * @param sortingMode: string
     * @param movies: MovieModel[]
     * @returns {MovieModel[]}
     * @description Sorts the array of movies based on id (sorting filed) and sortingMode (ascending/descending).
     */
    const sortMovies = (id, sortingMode, movies) => {
        const sortedMovies = [...movies];
        switch (id) {
            case 'title':
                sortedMovies.sort((movieA, movieB) => sortingComparator(movieA, movieB, 'title', sortingMode));
                return sortedMovies;
            case 'year':
                sortedMovies.sort((movieA, movieB) => sortingComparator(movieA, movieB, 'year', sortingMode));
                return sortedMovies;
            case 'genre':
                return sortedMovies;
            case 'actors':
                return sortedMovies;
            case 'plot':
                sortedMovies.sort((movieA, movieB) => sortingComparator(movieA, movieB, 'plot', sortingMode));
                return sortedMovies;
            default:
                return sortedMovies;
        }
    }

    let moviesContent = <div className={classes.NoContent}><Spinner/></div>

    if (!loading) {
        moviesContent = (
            movies.length > 0 ?
                movies.map(movie => <MovieCard key={movie.id} {...movie}/>)
                :
                <div className={classes.NoContent}>
                    <h1>{error}</h1>
                </div>

        );
    }
    return (
        <div className={classes.MovieFinder}>
            <div className={classes.MovieFinderFormContainer}>
                <MovieFinderForm onSubmit={onFindMovies}/>
            </div>
            <div className={classes.MovieFinderViewContainer}>
                <SortingControls controls={sortingControls} onClick={controlOnClick}/>
                <div className={classes.Content}>
                    {moviesContent}
                </div>
            </div>
        </div>
    );
};

export default MovieFinder;
