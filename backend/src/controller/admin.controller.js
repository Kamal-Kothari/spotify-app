import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
// Function to upload a file to Cloudinary and return the secure URL

const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
      folder: "music-app", // Specify the folder in Cloudinary where you want to store the files
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};
export const createSong =  async (req, res, next) => {
  try {
    if(!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Audio file and image are required" });
    }
    const {title, artist, albumId, duration} = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      duration,
      audioUrl,
      imageUrl,
      albumId: albumId || null, 
    });
    // Save the song to the database
    const savedSong = await song.save();
    // If albumId is provided, update the album with the new song
    if (albumId) {
      const album = await Album.findById(albumId);
      if (album) {
        album.songs.push(savedSong._id);
        await album.save();
      } else {
        return res.status(404).json({ message: "Album not found" });
      }
    }

    // find by id and update
    // if(albumId) {
    //   await Album.findByIdAndUpdate(albumId, {
    //     $push: { songs: savedSong._id }
    //   }, { new: true });
    // }

    // Respond with the created song
    res.status(201).json(savedSong);


  } catch (error) {
    console.error("Error creating song:", error);
    // res.status(500).json({ message: "Internal server error" });
    next(error); // Pass the error to the next middleware for centralized error handling
    
  }
}