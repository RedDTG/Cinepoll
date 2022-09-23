// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import mock from "../../mock/shows.json" assert { type: "json" };
import dontworrydarling from "../../mock/09-23-don-t-worry-darling-showtimes.json" assert { type: "json" };
import lesenfantsdesautres from "../../mock/09-23-les-enfants-des-autres-showtimes.json" assert { type: "json" };
import unebellecourse from "../../mock/09-23-une-belle-course-showtimes.json" assert { type: "json" };
import lessecretsdemonpere from "../../mock/09-23-les-secrets-de-mon-pere-showtimes.json" assert { type: "json" };
import moonagedaydream from "../../mock/09-23-moonage-daydream-showtimes.json" assert { type: "json" };

export default async function handler(req, res) {
  const { date } = req.query

  const body = mock

  const response = {}

  // const showsRes = await fetch('https://www.cinemaspathegaumont.com/api/cinema/cinema-gaumont-nantes/shows?language=fr',
  // {
  //   headers: {
  //     'User-Agent': 'le ban abuse aussi la'
  //   }
  // })

  // if (gaumontRes.ok) {
  //   const body = await gaumontRes.json()
  // } else {
  //   // handle l'error
  // }


  delete body["days"]
  delete body["upsellWeek"]

  const excludedFlags = ['OPERA']
  const whitelistProp = ['days']

  for (const [title, show] of Object.entries(body.shows)) {

    const firstDate = Object.keys(show.days)?.[0]

    if (firstDate && excludedFlags.includes(show.days[firstDate].flag)) {
      delete body.shows[title]
    }

    for (const [date_key, date_val] of Object.entries(show.days)) {
      if (date_key !== date) {
        delete show.days[date_key]
      }
    }

    if (Object.keys(show.days).length === 0) {
      delete body.shows[title]
    }

    // const movieRes = await fetch(`https://www.cinemaspathegaumont.com/api/show/${title}/showtimes/cinema-gaumont-nantes/${date}`,
    // {
    //   headers: {
    //     'User-Agent': 'le ban abuse aussi la'
    //   }
    // })

    // if (movieRes.ok) {
    //   const body = await movieRes.json()
    // } else {
    //   // handle l'error
    // }

    // console.log(`../../mock/09-23-${title}-showtimes.json`)


    if (fs.existsSync(`mock/09-23-${title}-showtimes.json`)) {
      const movieRes = title.replaceAll("-", "")
      console.log(movieRes)
      response[title] = movieRes[date]
    }
    

  }

  

  res.status(200).json(body)
}
