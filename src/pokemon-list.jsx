import React, { useState, useEffect } from "react";
import axios from "axios";
import "./pokemon-list.css";
const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [displayCount, setDisplayCount] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async (offset = 0, limit = 5) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      const { results, count } = response.data;

      const pokemonData = await Promise.all(
        results.map(async (pokemon) => {
          const res = await axios.get(pokemon.url);
          return res.data;
        })
      );

      setPokemons((prevPokemons) => [...prevPokemons, ...pokemonData]);
      setTotalCount(count);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const loadMore = () => {
    const newDisplayCount = displayCount + 5;
    setDisplayCount(newDisplayCount);
    fetchPokemons(newDisplayCount);
  };

  // Splitting pokemons into chunks of 5 for rows
  const pokemonsInRows = [];
  for (let i = 0; i < pokemons.length; i += 5) {
    pokemonsInRows.push(pokemons.slice(i, i + 5));
  }

  return (
    <div>
      <div className="PokemonList">
        {pokemonsInRows.map((row, rowIndex) => (
          <div key={rowIndex} className="PokemonCard">
            {row.map((pokemon, index) => (
              <div key={index} className="Card">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="PokemonImage"
                />
                <p>{pokemon.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        displayCount < totalCount && (
          <div className="LoadMoreButton">
            {" "}
            {/* Ganti dengan div untuk memuat lebih banyak */}
            <button onClick={loadMore}>Load more</button>
          </div>
        )
      )}
    </div>
  );
};

export default PokemonList;
