import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Proposal extends BaseModel {
  public static table = 'proposals'

  @column()
  public id: number

  @column({ isPrimary: true })
  public proposalId: string

  @column()
  public owner: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public category: string

  @column()
  public status: string

  @column()
  public primaryImgUrl: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
