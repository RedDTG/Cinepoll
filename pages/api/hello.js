// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';

export default async function handler(req, res) {
  const mock = {}

  mock.showtimes = JSON.parse(fs.readFileSync("mock/showtimes.json"))
  mock.shows = JSON.parse(fs.readFileSync("mock/shows.json")).shows
  mock.movies = {}
  mock.movies["don-t-worry-darling"] = JSON.parse(fs.readFileSync("mock/09-23-don-t-worry-darling-showtimes.json"))
  mock.movies["les-enfants-des-autres"] = JSON.parse(fs.readFileSync("mock/09-23-les-enfants-des-autres-showtimes.json"))
  mock.movies["une-belle-course"] = JSON.parse(fs.readFileSync("mock/09-23-une-belle-course-showtimes.json"))
  mock.movies["les-secrets-de-mon-pere"] = JSON.parse(fs.readFileSync("mock/09-23-les-secrets-de-mon-pere-showtimes.json"))
  mock.movies["moonage-daydream"] = JSON.parse(fs.readFileSync("mock/09-23-moonage-daydream-showtimes.json"))

  const { date } = req.query

 

  const response = {}

  // const showsRes = await fetch('https://www.cinemaspathegaumont.com/api/shows',
  // {
  //   headers: {
  //     'User-Agent': 'le ban abuse aussi la'
  //   }
  // })

  // if (showsRes.ok) {
  //   const showtimes = await showsRes.json()
  // } else {
  //   // handle l'error
  // }
  const shows = mock.shows


  // const cineRes = await fetch('https://www.cinemaspathegaumont.com/api/cinema/cinema-gaumont-nantes/shows?language=fr',
  // {
  //   headers: {
  //     'User-Agent': 'le ban abuse aussi la'
  //   }
  // })

  // if (cineRes.ok) {
  //   const cineShowtimes = await cineRes.json()
  // } else {
  //   // handle l'error
  // }
  const cineShowtimes = mock.showtimes


  delete cineShowtimes["days"]
  delete cineShowtimes["upsellWeek"]

  const excludedFlags = ['OPERA']

  for (const [title, show] of Object.entries(cineShowtimes.shows)) {

    const firstDate = Object.keys(show.days)?.[0]

    if (firstDate && excludedFlags.includes(show.days[firstDate].flag)) {
      delete cineShowtimes.shows[title]
    }

    for (const [date_key, date_val] of Object.entries(show.days)) {
      if (date_key !== date) {
        delete show.days[date_key]
      }
    }

    if (Object.keys(show.days).length === 0) {
      delete cineShowtimes.shows[title]
    }

    // const movieRes = await fetch(`https://www.cinemaspathegaumont.com/api/show/${title}/showtimes/cinema-gaumont-nantes/${date}`,
    // {
    //   headers: {
    //     'User-Agent': 'le ban abuse aussi la'
    //   }
    // })

    // if (movieRes.ok) {
    //   const movie = await movieRes.json()
    // } else {
    //   // handle l'error
    // }
    if (Object.hasOwn(mock.movies, title)) {
      const movieRes = mock.movies[title]
      const show = shows.find( ({ slug }) => slug === title)
      response[title] = {
        title: show.title,
        posters: show.posterPath,
        genres: show.genres,
        warning: show.warning,
        showtimes: movieRes
      }
      
    }

  }

  res.status(200).json(response)
}
