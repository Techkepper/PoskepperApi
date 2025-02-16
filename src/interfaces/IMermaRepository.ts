import { IMerma } from './IMerma'

export interface IMermaRepository {
  registrar(merma: IMerma): Promise<IMerma | null>
  obtenerTodos(): Promise<IMerma[] | null>
}
