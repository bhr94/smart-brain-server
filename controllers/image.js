
const Clarifai = require("clarifai");

const app = new Clarifai.App({
    apiKey: '51e0852a5fff4442bbeb2048ee359eeb'
   });




const handleApiCall = (req, res) => {
    app.models
      // This part has been updated with the recent Clarifai changed. Used to be:
      // .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
      .predict({
        id: "a403429f2ddf4b49b307e318f00e528b",
        version: "34ce21a40cc24b6b96ffee54aabff139",
      }, req.body.input)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.status(400).json('unable to work with API');
      })
  }

  module.exports = {
     handleApiCall
}