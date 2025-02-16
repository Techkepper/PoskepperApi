import { container } from 'tsyringe'
import { type IAuthRepository } from '../interfaces/IAuthRepository'
import { ICajaRepository } from '../interfaces/ICajaRepository'
import { type ICategoriaRepository } from '../interfaces/ICategoriaRepository'
import { type IClienteRepository } from '../interfaces/IClienteRepository'
import { type IFacturaRepository } from '../interfaces/IFacturaRepository'
import { type IMesaRepository } from '../interfaces/IMesaRepository'
import { type IOrdenRepository } from '../interfaces/IOrdenRepository'
import { type IProductoRepository } from '../interfaces/IProductoRepository'
import { type ITomaRepository } from '../interfaces/ITomaRepository'
import { type IUsuarioRepository } from '../interfaces/IUsuarioRepository'
import { type IUtilRepository } from '../interfaces/IUtilRepository'
import { IMovimientoInventarioRepository } from '../interfaces/IMovimientoInventarioRepository'
import { AuthRepository } from '../repositories/AuthRepository'
import { CajaRepository } from '../repositories/CajaRepository'
import { CategoriaRepository } from '../repositories/CategoriaRepository'
import { ClienteRepository } from '../repositories/ClienteRepository'
import { FacturaRepository } from '../repositories/FacturaRepository'
import { MesaRepository } from '../repositories/MesaRepository'
import { OrdenRepository } from '../repositories/OrdenRepository'
import { ProductoRepository } from '../repositories/ProductoRepository'
import { TomaRepository } from '../repositories/TomaRepository'
import { UsuarioRepository } from '../repositories/UsuarioRepository'
import { UtilRepository } from '../repositories/UtilRepository'
import { MovimientoInventarioRepository } from '../repositories/MovimientoInventarioRepository'
import { IMermaRepository } from '../interfaces/IMermaRepository'
import { MermaRepository } from '../repositories/MermaRepository'

/**
 * Registro del repositorio de usuarios en el contenedor de dependencias.
 */
container.registerSingleton<IUsuarioRepository>(
  'UsuarioRepository',
  UsuarioRepository,
)

/**
 * Registro del repositorio de auth en el contenedor de dependencias.
 */
container.registerSingleton<IAuthRepository>('AuthRepository', AuthRepository)

/**
 * Registro del repositorio de productos en el contenedor de dependencias.
 */
container.registerSingleton<IProductoRepository>(
  'ProductoRepository',
  ProductoRepository,
)

/**
 * Registro del repositorio de clientes en el contenedor de dependencias.
 */
container.registerSingleton<IClienteRepository>(
  'ClienteRepository',
  ClienteRepository,
)

/**
 * Registro del repositorio de categorías en el contenedor de dependencias.
 */
container.registerSingleton<ICategoriaRepository>(
  'CategoriaRepository',
  CategoriaRepository,
)

/**
 * Registro del repositorio de mesas en el contenedor de dependencias.
 */
container.registerSingleton<IMesaRepository>('MesaRepository', MesaRepository)

/**
 * Registro del repositorio de ordenes en el contenedor de dependencias.
 */
container.registerSingleton<IOrdenRepository>(
  'OrdenRepository',
  OrdenRepository,
)

/**
 * Registro del repositorio de cajas en el contenedor de dependencias.
 */
container.registerSingleton<ICajaRepository>('CajaRepository', CajaRepository)

/**
 * Registro del repositorio de tomas en el contenedor de dependencias.
 */
container.registerSingleton<ITomaRepository>('TomaRepository', TomaRepository)

/**
 * Registro del repositorio de utilidades en el contenedor de dependencias.
 */
container.registerSingleton<IUtilRepository>('UtilRepository', UtilRepository)

/**
 * Registro del repositorio de facturas en el contenedor de dependencias.
 */
container.registerSingleton<IFacturaRepository>(
  'FacturaRepository',
  FacturaRepository,
)

/**
 * Registro del repositorio de movimientos de inventario en el contenedor de dependencias.
 */
container.registerSingleton<IMovimientoInventarioRepository>(
  'MovimientoInventarioRepository',
  MovimientoInventarioRepository,
)

/**
 * Registro del repositorio de mermas en el contenedor de dependencias.
 */
container.registerSingleton<IMermaRepository>(
  'MermaRepository',
  MermaRepository,
)
