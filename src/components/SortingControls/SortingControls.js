import React from 'react';
import SortingControl from "./SortingControl/SortingControl";
import PropTypes from 'prop-types'
import classes from './SortingControls.module.css'

/**
 * @author Vladimir Dabic
 * @param props
 * @returns SortingControls component
 * @description Renders the SortingControls component, which is used as a container for SortingControl components.
 */
const SortingControls = props => {

    const controls = Object.keys(props.controls).map(control => {
        return {
            id: control,
            mode: props.controls[control].mode,
            label: props.controls[control].label,
            active: props.controls[control].active
        }
    });

    return (
        <div className={classes.SortingControls}>
            {
                controls.map(control => {
                    return <SortingControl
                        key={control.id}
                        controlTitle={control.label}
                        active={control.active}
                        mode={control.mode}
                        onClick={() => props.onClick(control.id)}/>
                })
            }

        </div>
    );
};

SortingControls.propTypes = {
    controls: PropTypes.shape({
        title: PropTypes.shape({
            mode: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired
        }),
        year: PropTypes.shape({
            mode: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired
        }),
        genre: PropTypes.shape({
            mode: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired
        }),
        actors: PropTypes.shape({
            mode: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired
        }),
        plot: PropTypes.shape({
            mode: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            active: PropTypes.bool.isRequired
        })
    }).isRequired
}
export default SortingControls;
