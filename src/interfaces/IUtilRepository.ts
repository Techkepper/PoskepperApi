export interface IUtilRepository {
  obtenerHoraBD(): Promise<string | null>
}
