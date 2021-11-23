import React, {useState, useEffect, useCallback} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App(callback, deps) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const firebaseDB = 'https://react-api-k-default-rtdb.firebaseio.com/movies.json';
  // const firebaseDB = 'https://swapi.dev/api/filmss/';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchMoviesHandler = useCallback (async () => {
    setIsLoading(true);
    setError(null);

    // fetch('https://swapi.dev/api/films')
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     const transformedMovies = data.results.map((movieData) => {
    //       return {
    //         id: movieData.episode_id,
    //         title: movieData.title,
    //         openingText: movieData.opening_crawl,
    //         releaseDate: movieData.release_date
    //       }
    //     });
    //
    //     setMovies(transformedMovies);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    try{
      const response = await fetch(firebaseDB);

      if (!response.ok){
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      if (!data){
        throw new Error('No data...');
      }else{
        const loadedMoviesData = [];
        for (const key in data) {
          loadedMoviesData.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,
          })
        };

        // const transformedMovies = data.map((movieData) => {
        //         return {
        //           id: movieData.episode_id,
        //           title: movieData.title,
        //           openingText: movieData.opening_crawl,
        //           releaseDate: movieData.release_date
        //         }
        //       });

        setMovies(loadedMoviesData);
      }
    }catch(err){
      console.log(err.message);
      setError(err.message);
    }
    setIsLoading(false);
  }, []);

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  const addMovieHandler = async (movie) => {
    try{
      const response = await fetch(firebaseDB, {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type':'application/json'
        }
      });

      if (!response.ok){
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      if (!data){
        throw new Error('No data...');
      }

      console.log(data);
    }catch(err){
      console.log(err.message);
      setError(err.message);
    }
  };

  const content = movies.length > 0? <MoviesList movies={movies}/> : error? <p>{error}</p> : isLoading? <p>Loading...</p> : <p>Found no movies</p>;

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}></AddMovie>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {/*{!isLoading && movies.length > 0 && <MoviesList movies={movies} />}*/}
        {/*{!isLoading && movies.length === 0 && !error && <p>No movies loaded...</p>}*/}
        {/*{!isLoading && error && <p>{error}</p>}*/}
        {/*{isLoading && <p>Loading...</p>}*/}
      </section>
    </React.Fragment>
  );
}

export default App;
