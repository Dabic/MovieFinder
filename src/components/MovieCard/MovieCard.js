import React from 'react';
import PropTypes from 'prop-types';
import classes from './MovieCard.module.css'

/**
 * @author Vladimir Dabic
 * @param props
 * @returns MovieCard component
 * @description Renders a MovieCard component. The component is used for graphical representation of the Movie object containing
 * movie poster, title, year, genre, actors, runtime and plot which are passed by props.
 */
const MovieCard = props => {
    let actors = '';
    props.actors.forEach((actor, i) => {
        if (i === props.actors.length - 1) {
            actors = actors + actor;
        } else {
            actors = actors + actor + ', ';
        }
    });

    let genre = '';
    props.genre.forEach((item, i) => {
        if (i === props.genre.length - 1) {
            genre = genre + item;
        } else {
            genre = genre + item + '|';
        }
    });

    return (
        <div className={classes.MovieCard}>
            <div className={classes.Info}>
                <div className={classes.Header}>
                    <img className={classes.Poster} src={props.poster} alt="Movie Poster"/>
                    <h1>{props.title}</h1>
                    <h4>{props.year}, {actors}</h4>
                    <span className={classes.Minutes}>{props.duration}</span>
                    <p className={classes.Genre}>{genre}</p>
                </div>

                <div className={classes.Desc}>
                    <p className={classes.Plot}>{props.plot}</p>
                </div>

            </div>
            <div style={{background: `url(${props.poster})`}} className={classes.Blur}/>
        </div>
    );
};

MovieCard.propTypes = {
    title: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    genre: PropTypes.array.isRequired,
    actors: PropTypes.array.isRequired,
    plot: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired
};

export default MovieCard;
