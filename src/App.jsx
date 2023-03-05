import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import { auth, db, storage } from "./config/firebase";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setMovieTitle] = useState("");
  const [newReleaseDate, setReleaseDate] = useState(0);
  const [isBestOnYoutube, setIsBestOnYoutube] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  // Delete a movie from the movies collection
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  // Update a movie title in the movies collection
  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
  };

  // Upload a file
  const uploadFile = async () => {
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);

    if (!fileUpload) return;
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getMovieList = async () => {
      // Get movies from the database
      try {
        const data = await getDocs(moviesCollectionRef);
        setMovieList(
          data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    getMovieList();
  }, [movieList]);

  const onSubmitMovie = async () => {
    // Add a new movie to the list of movies
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle.trim(),
        releaseDate: newReleaseDate,
        numberOneOnYoutube: isBestOnYoutube,
        userId: auth?.currentUser?.uid,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Auth />
      <div>
        <input
          type="text"
          placeholder="Movie title..."
          onChange={(e) => setMovieTitle(e.target.value)}
        />
        <input
          type="number"
          placeholder="Release date..."
          onChange={(e) => setReleaseDate(Number(e.target.value))}
        />
        <br />
        <input
          type="checkbox"
          checked={isBestOnYoutube}
          onChange={(e) => setIsBestOnYoutube(e.target.checked)}
        />
        <label>Best on YouTube</label>
        <br />
        <button onClick={onSubmitMovie}>Submit</button>
      </div>
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.numberOneOnYoutube ? "green" : "red" }}>
              {movie.title}
            </h1>
            <p>Date: {movie.releaseDate}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete</button>
            <input
              type="text"
              placeholder="New movie title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button onClick={() => updateMovieTitle(movie.id)}>
              Update Movie Title
            </button>
          </div>
        ))}
      </div>
      <div>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <button onClick={uploadFile}>Upload File</button>
      </div>
    </div>
  );
}

export default App;
