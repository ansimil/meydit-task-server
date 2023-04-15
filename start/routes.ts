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
import User from 'App/Models/User';
import Proposal from 'App/Models/Proposal';
import { Application } from '@adonisjs/core/build/standalone';

Route.get('/proposals', async ({response}) => {
  const proposals = await Proposal.all()
  response.ok(proposals)
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

    const image = request.file("primaryImgUrl")

    if (image) {
      await image.moveToDisk('./', {}, "s3")
    }

  

    const newProposal = {
      proposalId: uuid(),
      title: payload.proposalName,
      description: payload.proposalDescription,
      category: payload.proposalCategory,
      status: "open",
    }
    const proposal = new Proposal()
    .fill({...newProposal})
    .save()
    response.ok(proposal)
  } catch (error) {
    console.log(error)
    response.badRequest(error.messages)
  }

})

Route.post('/signup', async ({ request, response }) => {
  const { email, firstName, surname, password } = request.body()
  const hashedPassword = await Hash.make(password)
  const userId = uuid()
  const existingUser = await User.findBy('email_address', email)

  if (existingUser){
    response.unauthorized("user already exists")
    return
  }

  const user = new User()
  
  try {
    await user
    .fill({
      firstName: firstName,
      surname: surname,
      emailAddress: email,
      password: hashedPassword,
      userId: userId,
    })
    .save()
    response.ok(user)
  } 
  catch(err) {
    response.ok("registration successful")
  }
})

Route.post('/login', async ({ auth, request, response }) => {
  const email = request.input('email')
  const password = request.input('password')
  try {
    const user = await auth.use('api').attempt(email, password)
    response.ok(user)
  } catch {
    response.badRequest('Invalid credentials')
    return
  }

})


Route.get('/auth/verify', async ({ auth, response }) => {
  try {
    const user = await auth.use('api').authenticate()
    response.ok(user)
  }
  catch(err){
    response.unauthorized("user logged out")
  }
})

Route.post('/logout', async ({ auth }) => {
  await auth.use('api').revoke()
  return {
    revoked: true
  }
})


