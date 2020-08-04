import React from 'react';
import PropTypes from 'prop-types';
import classes from './Button.module.css'

const Button = props => {
    return (
        <button
            disabled={props.disabled}
            className={[classes.Button, classes[props.buttonType]].join(' ')}
            onClick={props.buttonClicked}>
            {props.children}
        </button>
    );
};

Button.propTypes = {
    buttonType: PropTypes.string.isRequired,
    buttonClicked: PropTypes.func,
    disabled: PropTypes.bool
};

export default Button;
