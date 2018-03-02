import React, { Component } from 'react';
import Navigation from './components/navigation/Navigation';
// import Logo from './components/logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import Signin from './components/signin/Signin'; 
import Register from './components/register/Register';

import Clarifai from 'clarifai';
import Particles from 'react-particles-js';

import './App.css';

const particleOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800,
        }
      }
    }
}

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
});

const initialValues = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      'id': '',
      'name': '',
      'email': '',
      'entries': 0,
      'joined': '',
    }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialValues;
  }

  getFaceLocation = (data) => {
    const { bottom_row, left_col, right_col, top_row } = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = image.width;
    const height = image.height;
    return {
      leftCol: left_col * width,
      topRow: top_row * height,
      rightCol: width - (right_col * width),
      bottom_row: height - (bottom_row * height),
    }
  }

  displayBox = (facelocation) => {
    this.setState({box: facelocation});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmitButton = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      if (response) {
        fetch('https://serene-harbor-62786.herokuapp.com/image', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayBox(this.getFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialValues)
      route = 'signin'
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  render() {
    const { isSignedIn, input, imageUrl, box, route} = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={particleOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {/* <Logo/> */}
        {(route === 'signin') ? (
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        ) : (route === 'register') ? (
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        ) : (
        <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onSubmitButton={this.onSubmitButton}/>
            <FaceRecognition imageUrl={imageUrl} displayFace={box}/>
        </div>
        )}
      </div>
    );
  }
}

export default App;
