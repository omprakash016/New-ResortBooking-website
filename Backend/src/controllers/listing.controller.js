const hotelModel = require("../models/listings");
const {uploadFile} = require("../services/storage.services");


exports.createHotel = async (req, res) => {
  try {

    const{title,description,location,price ,contact ,status}=req.body;

    let imageUrl = null;
    console.log(req.body);
    console.log(req.file);
    if (req.file) {
      try {
        const result = await uploadFile(req.file.buffer.toString('base64'));
        imageUrl = result.url;
        console.log(imageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(400).json({
          message: "Image upload failed",
          error: uploadError.message
        });
      }
    } else {
      console.warn('No file provided in request');
    }

    const hotel = await hotelModel.create({
      title: title,
      description: description,
      location: location,
      price: price,
      contact:contact,
      image: imageUrl,
      status:status,
      owner: req.user.id
    });

    res.status(201).json({
      message: "Hotel created",
      hotel
    });

  } catch (error) {

    console.log(error);
    res.status(500).json({
      message: "error to creacte Listing" ,error:error.message
    });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const hotels = await hotelModel.find()
      .populate("owner", "name email");

    res.json(hotels);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching hotels",
      error: error.message
    });
  }
};

exports.deleteHotel = async (req, res) => {
  try {
    const wonerId = req.user.id;
    if (!wonerId) {
      return res.status(400).json({ message: "owner id required in body" });
    }
    const hotel = await hotelModel.findById(req.params.id).populate("owner", "_id");
    if (!hotel) {
      return res.status(404).json({ message: "hotel not found" });
    }
    if (!hotel.owner || hotel.owner._id.toString() !== wonerId) {
      return res.status(403).json({
        message: "You are not authorized to delete this hotel"
      });
    }
    await hotelModel.findByIdAndDelete(req.params.id);
    res.json({
      message: "Hotel deleted"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting hotel",
      error: error.message
    });
  }
};

exports.updateHotel = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      title,
      description,
      location,
      price,
      contact,
      status
    } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // Find hotel
    const hotel = await hotelModel.findById(
      req.params.id
    );

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    // Authorization check
    if (
      hotel.owner.toString() !==
      userId
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this hotel"
      });
    }

    let imageUrl = hotel.image; // keep old image

    // Upload new image if provided
    if (req.file) {
      try {

        const result =
          await uploadFile(
            req.file.buffer.toString(
              "base64"
            )
          );

        imageUrl = result.url;

      } catch (uploadError) {

        console.error(
          "Image upload failed:",
          uploadError
        );

        return res.status(400).json({
          message:
            "Image upload failed",
          error:
            uploadError.message
        });
      }
    }

    // Update hotel
    const updatedHotel =
      await hotelModel.findByIdAndUpdate(
        req.params.id,
        {
          title,
          description,
          location,
          price,
          contact,
          status,
          image: imageUrl
        },
        {
          new: true,
          runValidators: true
        }
      );

    res.json({
      message:
        "Hotel updated successfully",
      hotel: updatedHotel
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Error updating hotel",
      error: error.message
    });

  }
};