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
import request from 'superagent';

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
  apiKey: 'd016cbcb686f4a15a25fc358c175c85a'
});

const CLOUDINARY_UPLOAD_PRESET = 'pg7zdx0l';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dmzzngrru/image/upload';

const initialValues = {
    input: '',
    imageUrl: '',
    box: [],
    route: 'signin',
    isSignedIn: false,
    isDemo: false,
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
    const lengthOfApi = data.outputs[0].data.regions.length;
    const image = document.getElementById('inputimage');
    const width = image.width;
    const height = image.height;
    let faceArray = [];
    for(let i = 0; i < lengthOfApi; i++){
      let { bottom_row, left_col, right_col, top_row } = data.outputs[0].data.regions[i].region_info.bounding_box;
      let box = {
        leftCol: left_col * width,
        topRow: top_row * height,
        rightCol: width - (right_col * width),
        bottom_row: height - (bottom_row * height),
      }
      faceArray.push(box);
    }
    return faceArray;
  }

  displayBox = (facelocation) => {
    this.setState({box: facelocation});
  }

  onInputChange = (file) => {
    this.setState({box: []})
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {
        this.setState({
          imageUrl: response.body.secure_url
        });
      }
    })
  }

  onSubmitButton = () => {
    this.setState({imageUrl: this.state.imageUrl})
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
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
    } else if (route === 'demo'){
      this.setState({isDemo: !this.state.isDemo})
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
        <Navigation isSignedIn={isSignedIn} 
        onRouteChange={this.onRouteChange} 
        route={this.state.route}
        isDemo={this.state.isDemo}/>
        {/* <Logo/> */}
        {(route === 'signin') ? (
          <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        ) : (route === 'register') ? (
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        ) : (
        <div>
            <Rank name={this.state.user.name} entries={this.state.user.entries} route={this.state.route}/>
            <ImageLinkForm onInputChange={this.onInputChange} onSubmitButton={this.onSubmitButton}/>
            <FaceRecognition imageUrl={imageUrl} displayFace={box}/>
        </div>
        )}
      </div>
    );
  }
}

export default App;
