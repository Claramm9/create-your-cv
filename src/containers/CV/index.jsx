/* eslint-disable array-callback-return */
import { Record } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './styles.css';
import Sidebar from './components/Sidebar/index.jsx';
import Header from '../../components/Header/index.jsx';
import Education from './containers/Education/index.jsx';
import Aptitudes from './containers/Aptitudes/index.jsx';
import Information from './containers/Information/index.jsx';
import WorkExperience from './containers/WorkExperience/index.jsx';
import Recommendation from './containers/Recommendations/index.jsx';

class CV extends Component {

  static propTypes = {
    Cv: PropTypes.instanceOf(Record).isRequired
  }

  state = {
    infoCompleted: false,
    eduCompleted: false,
    workCompleted: false,
    aptitudCompleted: false,
    recomCompleted: false,
    allCompleted: false
  }

  completed = (name, value) => {
    this.setState(
      { [name]: value },
      () => {
        if (this.state.infoCompleted && this.state.eduCompleted 
                && this.state.workCompleted && this.state.aptitudCompleted) {
          this.setState({ allCompleted: true });
        }
      }
    );
  }

  hideButton = () => {
    this.setState({ allCompleted: false });
  }

  writeJSON = (data, info) => fetch(`http://localhost:3000/${info}`, {
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then((response) => response.json());

  deleteJSON = (info) => {
    fetch(`http://localhost:3000/${info}`)
      .then(resp => resp.json())
      .then(data => {
        data.map(field => {
          fetch(`http://localhost:3000/${info}/${field.id}`, 
            { method: 'DELETE' }).then((response) => response.json());
        });
      });
  }

  deleteAll = () => {
    this.deleteJSON('information');
    this.deleteJSON('education');
    this.deleteJSON('workExperience');
    this.deleteJSON('aptitudes');
    this.deleteJSON('recommendation');
  }

  writeAll = (information, education, workExperience, aptitudes, recommendations) => {
    this.writeJSON(information.toJS(), 'information');
    education.map(field => (
      this.writeJSON(field.toJS(), 'education')
    ));

    workExperience.map(field => (
      this.writeJSON(field.toJS(), 'workExperience')
    ));

    aptitudes.map(field => (
      this.writeJSON(field.toJS(), 'aptitudes')
    ));

    recommendations.map(field => (
      this.writeJSON(field.toJS(), 'recommendation')
    ));
  }

  handleDownload = (e) => {
    e.preventDefault();

    const information = this.props.Cv.get('information');
    const education = this.props.Cv.get('education');
    const workExperience = this.props.Cv.get('workExperience');
    const aptitudes = this.props.Cv.get('aptitudes');
    const recommendations = this.props.Cv.get('recommendations');

    this.deleteAll();
    this.writeAll(information, education, workExperience, aptitudes, recommendations);

  }

  render() {
    return (
      <Router>
        <div>
          <Header downloadButton={ this.state.allCompleted } onDownload={ this.handleDownload } />
          <div className="wrapper">
            <Sidebar flags={ this.state } />
            <div className="main">
              <Route
                path="/CV/personal-information"
                render={ (props) => (<Information 
                  { ...props } 
                  isCompleted={ this.completed } />) 
                } />
              <Route
                path="/CV/education"
                render={ (props) => (<Education 
                  { ...props } 
                  isCompleted={ this.completed } />) } />
              <Route
                path="/CV/work-experience"
                render={ (props) => (<WorkExperience 
                  { ...props } 
                  isCompleted={ this.completed } />) } />
              <Route
                path="/CV/aptitudes"
                render={ (props) => (<Aptitudes 
                  { ...props } 
                  isCompleted={ this.completed } 
                  onDelete={ this.hideButton } />) } />
              <Route
                path="/CV/recommendation"
                render={ (props) => (<Recommendation 
                  { ...props } 
                  isCompleted={ this.completed } />) } />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = ({ Cv }) => ({
  Cv
});

export default connect(mapStateToProps)(CV);