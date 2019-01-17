import { Map } from 'immutable';
import React, { Component } from 'react';

import './styles.css';
import { isEmpty, isValidDate } from './validator';

class Form extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     field1: '',
        //     field2: '',
        //     startDate: '',
        //     endDate: '',
        //     description: ''
        // };
        this.state = {
            fields: {},
            errors: {
                field1: '',
                field2: '',
                startDate: '',
                endDate: ''
            }
        }
    }

    validateForm = () => {
        let fields = this.state.fields;
        let errors = {
            field1: '',
            field2: '',
            startDate: '',
            endDate: ''
        };
        let formIsValid = true;

        if (isEmpty(fields.field1)) {
            formIsValid = false;
            errors.field1 = "*This field can not be empty.";
        }

        if (isEmpty(fields.field2)) {
            formIsValid = false;
            errors.field2 = "*This field can not be empty.";
        }

        if (isEmpty(fields.startDate)) {
            formIsValid = false;
            errors.startDate = "*This field can not be empty.";
        }

        if (typeof fields.startDate !== "undefined") {
            if (!isValidDate(fields.startDate)) {
                formIsValid = false;
                errors.startDate = "*Please enter a valid format.";
            }
        }

        if (isEmpty(fields.endDate)) {
            formIsValid = false;
            errors.endDate = "*This field can not be empty.";
        }

        if (typeof fields.endDate !== "undefined") {
            if (!isValidDate(fields.endDate)) {
                formIsValid = false;
                errors.endDate = "*Please enter a valid format.";
            }
        }
        this.setState({
            errors: errors
        });
        return formIsValid;
    }

    handleChange = (e) => {
        let fields = this.state.fields;
        fields[e.target.name] = e.target.value;
        this.setState({
            fields
        });
    }

    handleClick = (e) => {
        e.preventDefault();
        if (this.validateForm()) {
            const data = Map({
                field1: this.state.field1,
                field2: this.state.field2,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                description: this.state.description
            });
            this.setState({
                fields: {},
                errors: {
                    field1: '',
                    field2: '',
                    startDate: '',
                    endDate: ''
                }
            });
            this.props.onConfirm(data)
            alert("Saved!");
        }
    }
    render() {

        return (
            <form>
                <label className="modal-form">
                    {this.props.fields.get("field1")}:
                </label>
                <div className="personal-field">
                    <input
                        className="modal-input"
                        type="text" name="field1"
                        onChange={this.handleChange}
                        value={this.state.field1}
                    >
                    </input>
                    <span className="validation">{this.state.errors.field1}</span>
                </div>
                <label className="modal-form">
                    {this.props.fields.get("field2")}:
                </label>
                <div className="personal-field">
                    <input
                        className="modal-input"
                        type="text"
                        name="field2"
                        onChange={this.handleChange}
                        value={this.state.field2}
                    >
                    </input>
                    <span className="validation">{this.state.errors.field2}</span>
                </div>
                <label className="modal-form">
                    {this.props.fields.get("startDate")}:
                </label>
                <div className="personal-field">
                    <input
                        className="modal-input"
                        type="text"
                        name="startDate"
                        placeholder="MM-DD-YYYY"
                        onChange={this.handleChange}
                        value={this.state.startDate}
                    >
                    </input>
                    <span className="validation">{this.state.errors.startDate}</span>
                </div>
                <label className="modal-form">
                    {this.props.fields.get("endDate")}:
                </label>
                <div className="personal-field">
                    <input
                        className="modal-input"
                        type="text"
                        name="endDate"
                        placeholder="MM-DD-YYYY"
                        onChange={this.handleChange}
                        value={this.state.endDate}
                    >
                    </input>
                    <span className="validation">{this.state.errors.endDate}</span>
                </div>
                <label className="modal-form">
                    {this.props.fields.get("description")}:
                </label>
                <textarea
                    rows="5"
                    id="description"
                    type="text"
                    name="description"
                    onChange={this.handleChange}
                    value={this.state.description}
                >
                </textarea>
                <div><input id="save" type="submit" value="Save" onClick={this.handleClick} /></div>
            </form >
        )
    }
}

export default Form;