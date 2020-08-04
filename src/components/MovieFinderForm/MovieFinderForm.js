import React, {useState} from 'react';
import formConf from "./formConf";
import Input from "../UI/Forms/Input/Input";
import classes from './MovieFinderForm.module.css';
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "../UI/Forms/Button/Button";

/**
 * @author Vladimir Dabic
 * @param props
 * @returns MovieFinderForm component
 * @description Renders the MovieFinderForm component which is used for searching for movies based on the given parameters.
 */
const MovieFinderForm = props => {

    const [formData, setFormData] = useState(formConf);

    const inputChangedHandler = (event, inputId) => {
        const updatedFormData = {...formData};
        const updatedFormElement = {...updatedFormData[inputId]};
        updatedFormElement.value = event.target.value;
        updatedFormData[inputId] = updatedFormElement;
        setFormData(updatedFormData);
    }

    const formObjects = Object.keys(formData).map(key => {
        return {
            id: key,
            elementType: formData[key].elementType,
            elementConfig: formData[key].elementConfig,
            value: formData[key].value
        };
    })

    let form = (
        <form>
            {
                formObjects.map(element => {
                    return <Input
                        key={element.id}
                        elementType={element.elementType}
                        elementConfig={element.elementConfig}
                        value={element.value}
                        changed={(event) => inputChangedHandler(event, element.id)}/>
                })
            }
        </form>
    )
    return (
        <div className={classes.MovieFinderForm}>
            <div className={classes.Header}>
                <div className={classes.Icon}>
                    <FontAwesomeIcon icon={faSearch}/>
                </div>
                <div className={classes.Heading}>
                    Find a Movie
                </div>
            </div>
            <div className={classes.Form}>
                {form}
            </div>
            <Button buttonType={'Success'}
                    buttonClicked={() => props.onSubmit(formData['title'].value, formData['year'].value)}>Search</Button>
        </div>
    );
};

export default MovieFinderForm;
