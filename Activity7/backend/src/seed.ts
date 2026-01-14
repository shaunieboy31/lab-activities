import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Project } from './projects/project.entity'
import { Task } from './tasks/task.entity'
import { User } from './users/user.entity'

async function run() {
  const ds = new DataSource({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [Project, Task, User],
    synchronize: true,
  })
  await ds.initialize()

  const projectRepo = ds.getRepository(Project)
  const taskRepo = ds.getRepository(Task)
  const userRepo = ds.getRepository(User)

  // clean
  await taskRepo.delete({})
  await projectRepo.delete({})
  await userRepo.delete({})

  // sample users
  const alice = userRepo.create({ username: 'alice', password: 'pass', role: 'user' })
  const bob = userRepo.create({ username: 'bob', password: 'pass', role: 'user' })
  await userRepo.save([alice, bob])

  // sample projects
  const p1 = projectRepo.create({ name: 'Website Redesign', description: 'Refresh landing page', status: 'open', dueDate: '2026-02-15' })
  const p2 = projectRepo.create({ name: 'Mobile App', description: 'v1 features', status: 'in-progress', dueDate: '2026-03-10' })
  await projectRepo.save([p1, p2])

  // sample tasks
  const tasks = [
    taskRepo.create({ title: 'Wireframes', description: 'Home + pricing', status: 'doing', dueDate: '2026-01-25', project: p1, assignee: alice }),
    taskRepo.create({ title: 'Hero copy', status: 'todo', dueDate: '2026-01-28', project: p1, assignee: bob }),
    taskRepo.create({ title: 'API auth', status: 'doing', dueDate: '2026-02-05', project: p2, assignee: alice }),
    taskRepo.create({ title: 'Push notifications', status: 'todo', project: p2, assignee: bob }),
  ]
  await taskRepo.save(tasks)

  console.log('Seed complete')
  await ds.destroy()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
