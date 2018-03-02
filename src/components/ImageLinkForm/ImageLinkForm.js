import React from 'react';
import Dropzone from 'react-dropzone';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onSubmitButton }) => {
    return (
        <div>
            <p className='pa3'>
                {'For those who are shy, we will cover your face with emojis. Give it a try'}
            </p> 
            <div className='center'>
                <div className='form center pa2 br3 shadow-5'>
                    <Dropzone
                    className='dropzone'
                    multiple={false}
                    accept="image/*"
                    onDrop={ onInputChange }>
                    <p className='form-text'>Drop an image or click to select a file to upload.</p>
                    </Dropzone>
                    {/* <input className='f4 pa2 w-70 center' type='text' onChange={ onInputChange } /> */}
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' 
                    onClick={ onSubmitButton }>Cover</button>
                </div>
                
            </div>
            
        </div>
    );
}

export default ImageLinkForm;