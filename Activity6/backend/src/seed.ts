import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Movie } from './entities/movie.entity'
import { Review } from './entities/review.entity'

async function run(){
  const ds = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Movie, Review],
    synchronize: true,
  })
  await ds.initialize()

  const movieRepo = ds.getRepository(Movie)
  const reviewRepo = ds.getRepository(Review)

  // Delete existing data
  await reviewRepo.delete({})
  await movieRepo.delete({})

  const m1 = movieRepo.create({ title: 'The First Adventure', description: 'An exciting journey.', releaseDate: '2020-05-01' })
  const m2 = movieRepo.create({ title: 'Romance in Code', description: 'Love and algorithms.', releaseDate: '2021-02-14' })
  const m3 = movieRepo.create({ title: 'Sci-Fi Epic', description: 'Space, time, and bugs.', releaseDate: '2019-11-11' })

  await movieRepo.save([m1, m2, m3])

  const r1 = reviewRepo.create({ movie: m1, rating: 5, comment: 'Loved it!' })
  const r2 = reviewRepo.create({ movie: m1, rating: 4, comment: 'Great visuals.' })
  const r3 = reviewRepo.create({ movie: m2, rating: 3, comment: 'Cute.' })
  const r4 = reviewRepo.create({ movie: m3, rating: 4, comment: 'Epic story.' })
  const r5 = reviewRepo.create({ movie: m3, rating: 2, comment: 'Too long.' })

  await reviewRepo.save([r1, r2, r3, r4, r5])

  // Recompute averages
  const movies = await movieRepo.find({ relations: ['reviews'] })
  for(const m of movies){
    const reviews = await reviewRepo.find({ where: { movie: { id: m.id } } })
    if(!reviews || reviews.length === 0){
      await movieRepo.update(m.id, { averageRating: 0 })
      continue
    }
    const sum = reviews.reduce((s, r) => s + r.rating, 0)
    const avg = parseFloat((sum / reviews.length).toFixed(2))
    await movieRepo.update(m.id, { averageRating: avg })
  }

  console.log('Seed complete')
  await ds.destroy()
}

run().catch(err=>{
  console.error(err)
  process.exit(1)
})
