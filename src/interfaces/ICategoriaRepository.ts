import { type ICategoria } from './ICategoria'

export interface ICategoriaRepository {
  obtenerCategorias(): Promise<
    { idCategoria: number; descripcion: string }[] | null
  >
  registrar(cliente: ICategoria): Promise<ICategoria | null>
  existeDescripcionCategoria(descripcion: string): Promise<boolean>
  existeCategoriaEnProductos(idCategoria: number): Promise<boolean>
  existeIdCategoria(idCategoria: number): Promise<boolean>
  eliminar(idCategoria: number): Promise<boolean>
  actualizar(
    id: number,
    categoria: Partial<ICategoria>,
  ): Promise<ICategoria | null>
}
