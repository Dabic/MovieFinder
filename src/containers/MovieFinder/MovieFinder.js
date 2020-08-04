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
     */
    async function getDetailedMovies(response) {
        const detailedMovies = [];
        try {
            for (const movie of response.data['Search']) {
                await axios.get(`http://www.omdbapi.com/?apikey=2ed3a9a0&t=${encodeURIComponent(movie.Title)}&y=${movie.Year}`)
                    .then(detailResponse => {
                        detailedMovies.push(new MovieModel(detailResponse.data));
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
     * @description Fetch movies based on the given parameters. Title parameter is required, while year parameter is optional.
     */
    const onFindMovies = (title, year = '', genre, actors, plot) => {
        setLoading(true);
        axios.get(`http://www.omdbapi.com/?apikey=2ed3a9a0&s=${encodeURIComponent(title)}&y=${year}`)
            .then(response => {
                getDetailedMovies(response).then(r => {
                    setMovies(sortMovies('title', 'ascending', r));
                    setLoading(false);
                });
            })
    };

    const sortMovies = (id, sortingMode, movies) => {
        const sortedMovies = [...movies];
        switch (id) {
            case 'title':
                if (sortingMode === 'descending') {
                    sortedMovies.sort((movieA, movieB) => {
                        if (movieA.title < movieB.title) {
                            return -1;
                        }
                        if (movieA.title > movieB.title) {
                            return 1;
                        }
                        return 0;
                    })
                } else {
                    sortedMovies.sort((movieA, movieB) => {
                        if (movieA.title < movieB.title) {
                            return 1;
                        }
                        if (movieA.title > movieB.title) {
                            return -1;
                        }
                        return 0;
                    })
                }
                return sortedMovies;
            case 'year':
                if (sortingMode === 'ascending') {
                    sortedMovies.sort((movieA, movieB) => {
                        if (movieA.year < movieB.year) {
                            return -1;
                        }
                        if (movieA.year > movieB.year) {
                            return 1;
                        }
                        return 0;
                    })
                } else {
                    sortedMovies.sort((movieA, movieB) => {
                        if (movieA.year < movieB.year) {
                            return 1;
                        }
                        if (movieA.year > movieB.year) {
                            return -1;
                        }
                        return 0;
                    })
                }
                return sortedMovies;
            case 'genre':
                break;
            case 'actors':
                break;
            case 'plot':
                break;
            default:
                break;
        }
    }

    let moviesContent = <div className={classes.NoContent}><Spinner/></div>

    if (!loading) {
        moviesContent = (
            movies.length > 0 ?
                movies.map(movie => <MovieCard key={movie.id} {...movie}/>)
                :
                <div className={classes.NoContent}>
                    <h1 style={{color: '#d6d62e', padding: '30px'}}>{error}</h1>
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
