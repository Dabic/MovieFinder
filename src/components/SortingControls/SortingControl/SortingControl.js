import React from 'react';
import PropTypes, {bool} from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowAltUp, faLongArrowAltDown} from "@fortawesome/free-solid-svg-icons";
import classes from './SortingControl.module.css'

/**
 * @author Vladimir Dabic
 * @param props
 * @returns SortingControl
 * @description Renders a SortingControl component. Each component sorts the array of movies based on component id.
 */
const SortingControl = props => {

    let controlClasses = [classes.SortingControl];

    if (props.active) {
        controlClasses.push(classes.Active);
    }

    let icon = <FontAwesomeIcon icon={faLongArrowAltDown}/>

    if (props.mode === 'ascending') {
        icon = <FontAwesomeIcon icon={faLongArrowAltUp}/>
    }
    return (
        <div onClick={props.onClick} className={controlClasses.join(' ')}>
            <div className={classes.Title}> {props.controlTitle} </div>
            <div className={classes.Icon}> {icon} </div>
        </div>
    );
};

SortingControl.propTypes = {
    controlTitle: PropTypes.string.isRequired,
    active: bool
};

export default SortingControl;
