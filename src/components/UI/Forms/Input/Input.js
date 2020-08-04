import React from 'react';
import PropTypes from 'prop-types';
import classes from './Input.module.css'

const Input = props => {

    let inputElement = null;

    switch (props.elementType) {
        case 'input':
            inputElement = <input
            onChange={props.changed}    
            className={classes.InputElement}
                {...props.elementConfig}
                value={props.value} />
            break;
        case 'textarea':
            inputElement = <textarea
            onChange={props.changed}    
            className={classes.InputElement}
                {...props.elementConfig}
                value={props.value} />
            break;
        default:
            inputElement = <input
            onChange={props.changed}    
            className={classes.InputElement}
                {...props.elementConfig}
                value={props.value} />
            break;
    }

    return (
        <div className={classes.Input}>
            {inputElement}
        </div>
    );
};

Input.propTypes = {
    elementType: PropTypes.string.isRequired,
    elementConfig: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    changed: PropTypes.func.isRequired,
};

export default Input;
