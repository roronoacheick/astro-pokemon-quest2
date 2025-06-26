

const NASA_BASE = 'https://api.nasa.gov/planetary';
const NASA_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;
const POKEAPI_BASE = process.env.NEXT_PUBLIC_POKEAPI_BASE;

export async function fetchPlanetImage(planetName) {
  const res = await fetch(
    `${NASA_BASE}/apod?api_key=${NASA_KEY}&date=2021-07-20`
  );
  if (!res.ok) throw new Error(`Erreur NASA API : ${res.status}`);
  const data = await res.json();
  return data.url;
}

export async function fetchPokemonsByGeneration(genNumber) {
  const res = await fetch(`${POKEAPI_BASE}/generation/${genNumber}`);
  if (!res.ok) throw new Error(`Erreur PokeAPI génération ${genNumber} : ${res.status}`);
  const json = await res.json();
  return json.pokemon_species;
}

export async function fetchPokemonDetails(name) {
  const res = await fetch(`${POKEAPI_BASE}/pokemon/${name}`);
  if (!res.ok) throw new Error(`Erreur PokeAPI détails pour ${name} : ${res.status}`);
  return res.json();
}
