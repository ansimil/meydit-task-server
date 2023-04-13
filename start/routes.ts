/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/
import Database from '@ioc:Adonis/Lucid/Database'
import Route from '@ioc:Adonis/Core/Route'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { v4 as uuid } from 'uuid';
import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon'

Route.get('/proposals', async () => {
  return await Database
  .from('proposals')
  .select('*')
  .debug(true)
})

Route.post('/add-proposal', async ({request, response}) => {
  const newProposalSchema = schema.create({
    proposalName: schema.string([
      rules.minLength(2)
    ]),
    proposalDescription: schema.string([
      rules.minLength(5)
    ]),
    proposalCategory: schema.string(),
  })
  try {
    const payload = await request.validate({
      schema: newProposalSchema
    })

    const proposal = {
      proposal_id: uuid(),
      title: payload.proposalName,
      description: payload.proposalDescription,
      category: payload.proposalCategory,
      status: "open",
    }

    await Database
    .table('proposals')
    .insert({...proposal})
    response.ok(payload)
  } catch (error) {
    console.log(error.messages)
    response.badRequest(error.messages)
  }

  
})

Route.post('/signup', async ({ request, response }) => {
  const { email, firstName, surname, password } = request.body()
  const hashedPassword = await Hash.make(password)
  const userId = uuid()
  const existingUser = await  Database
  .from('users')
  .where('email_address', email)

  if (existingUser.length > 0){
    response.unauthorized("user already exists")
    return
  }
  
  const user = {
    "first_name": firstName,
    "surname": surname,
    "email_address": email,
    "password": hashedPassword,
    "user_id": userId,
    "proposals": [],
    "jobs": [],
    "created_at": DateTime.now()
  }
  try {
    await Database
    .table('users')
    .insert({...user})
    response.ok("registration successful")
  }
  catch(error) {
    console.log(error.messages)
    response.badRequest(error.messages)
  }
})
// .middleware(async (ctx, next) => {
  
//   await next()
// })

