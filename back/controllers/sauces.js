const Sauce = require('../model/Sauce')
const { sauceValidation } = require('../middleware/sauceValidation')
const fs = require('fs'); // Node module for images


                                    // GET ALL SAUCE ON HOMEPAGE

exports.getAllSauce = (req, res, next) => {

    // Find all the sauces in the database
    Sauce.find()

    // Return the sauce
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({
        error
      }))
}


                                         // GET ONE SAUCE

exports.getOneSauce = (req, res, next) => {

    // Find the sauce ID we want in the DB
    Sauce.findOne({
        _id: req.params.id
    })

    // Return the sauce
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
    error
    }));
};


                                        // ADD A NEW SAUCE

exports.createSauce = async (req, res, next) => {

    // Create an object with req.body
    const sauceObject = JSON.parse(req.body.sauce)

    //Validate the data before we add a sauce
    const {error} = sauceValidation(sauceObject)
    if (error) return res.status(400).send(error.details[0].message)

    // Let Mongo DB create the Sauce ID by deleting the default one
    delete sauceObject._id;

    // Create a new sauce
    const sauce = new Sauce({
        ...sauceObject, // copy the object and add the rest

        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    // Save the sauce and send the response
    try {
      const savedSauce = await sauce.save()
      res.send({message: "Sauce créée"})
    } catch(err) {
          res.status(404).send(err)
    }
}


                                        // UPDATE A SAUCE 

exports.modifySauce = (req, res, next) => {

    let sauceObject = {}

    // If there is an image modification
    req.file ? (

        // Find the ID of the sauce to update
        Sauce.findOne({
            _id: req.params.id
        }).then((sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1]
            fs.unlinkSync(`images/${filename}`) // Delete the old image from the DB
        }),
      
      // Update the sauce object with the new image
      sauceObject = {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }  
    ) : ( // else just update the object with the new values
      sauceObject = {
        ...req.body
      }
    )

    //Validate the data before we update the sauce
    const {error} = sauceValidation(sauceObject)
    if (error) return res.status(400).send(error.details[0].message) 

    // Update the sauce with the new parameters
    Sauce.updateOne(
        {
          _id: req.params.id
        }, {
          ...sauceObject,
          _id: req.params.id
        }
    )

    // Send the response
    .then(() => res.status(200).json({
    message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
    error
    }))
}


                                        // DELETE A SAUCE

exports.deleteSauce = (req, res, next) => {

    // Find the ID of the sauce we want to delete
    Sauce.findOne({
        _id: req.params.id
    })

    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1] // Get the image url, split around the name of the file
        fs.unlink(`images/${filename}`, () => { // Delete the file and then, the rest

            Sauce.deleteOne({
                _id: req.params.id
            })
            .then(() => res.status(200).json({
                message: 'Sauce supprimée !'
            }))
            .catch(error => res.status(400).json({
                error
            }))
        })
    })

    .catch(error => res.status(500).json({
    error
    }));
}


                                        // LIKE OR DISLIKE A SAUCE
                                  
exports.likeDislike = (req, res, next) => {

    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id
  
    // Adding 1 like
    if (like === 1) { 
      Sauce.updateOne({
          _id: sauceId
        }, {
          $push: {
            usersLiked: userId
          },
          $inc: {
            likes: +1
          }
        })
        .then(() => res.status(200).json({
          message: '1 like added !'
        }))
        .catch((error) => res.status(400).json({
          error
        }))
    }

    // If 1 dislike
    if (like === -1) {
      Sauce.updateOne(
          {
            _id: sauceId
          }, {
            $push: {
              usersDisliked: userId
            },
            $inc: {
              dislikes: +1
            }
          }
        )
        .then(() => {
          res.status(200).json({
            message: '1 dislike added !'
          })
        })
        .catch((error) => res.status(400).json({
          error
        }))
    }

    // Update like or dislike
    if (like === 0) {
      Sauce.findOne({
          _id: sauceId
        })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { 
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersLiked: userId
                },
                $inc: {
                  likes: -1
                }
              })
              .then(() => res.status(200).json({
                message: '-1 like'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne({
                _id: sauceId
              }, {
                $pull: {
                  usersDisliked: userId
                },
                $inc: {
                  dislikes: -1
                }
              })
              .then(() => res.status(200).json({
                message: '-1 dislike'
              }))
              .catch((error) => res.status(400).json({
                error
              }))
          }
        })
        .catch((error) => res.status(404).json({
          error
        }))
    }
}                                   