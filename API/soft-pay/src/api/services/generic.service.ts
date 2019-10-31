import {Entity} from 'typeorm'

export interface GenericService {
    findById(id)
    create(Entity)
    deleteById(id)
    update(Entity)

}