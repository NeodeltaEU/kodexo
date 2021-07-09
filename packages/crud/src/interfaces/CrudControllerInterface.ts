import { CrudService } from '../CrudService'

export interface CrudControllerInterface<T> {
  service: CrudService<T>

  getOne?(req?: any): Promise<any>
}
