/* eslint-disable array-callback-return */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import './styles.css';
import Form from '../Form/index.jsx';
import { isEmpty, isValidDate } from '../../services/validation/validator';

const uuid = require('uuid/v4');

class FormModal extends Component {
  static propTypes = {
    fields: PropTypes.array.isRequired,
    info: PropTypes.instanceOf(Map),
    isEditing: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      fields: props.info ? props.info.toObject() : {},
      errors: {}
    };
  }

  validateForm = (data) => {
    const { fields } = this.props;
    const errors = {};
    let formIsValid = true;

    fields.map(field => {
      if (field.name !== 'description') {
        if (isEmpty(data[field.name])) {
          errors[field.name] = '*This field can not be empty.';
          formIsValid = false;
        }
      }
      if (field.name === 'startDate' || field.name === 'endDate') {
        if (!isValidDate(data[field.name])) {
          errors[field.name] = '*Please enter a valid format.';
          formIsValid = false;
        }
      }
    });
    this.setState({
      errors
    });
    return formIsValid;
  }

  handleChange = (e) => {
    const { fields } = this.state;
    fields[e.target.name] = e.target.value;
    this.setState({
      fields
    });
  }

  handleClick = (e) => {
    e.preventDefault();
    const { fields } = this.state;

    if (!this.props.isEditing) {
      fields.id = uuid();
      this.setState({
        fields
      });
    }
    if (this.validateForm(fields)) {
      this.props.onConfirm(fields);  
      this.setState({
        fields: {},
        errors: {}
      });
      
    }
  }

  render() {
    return (
      <Form 
        fields={ this.props.fields } 
        state={ this.state } 
        onChange={ this.handleChange } 
        onClick={ this.handleClick } 
        onKeyPress= { this.handlePress }
      >
      </Form>
    );
  }
}

export default FormModal;