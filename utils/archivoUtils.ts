export const esValidoElTamanoDeArchivo = (
  fileSize: number,
  maxSize: number,
): boolean => {
  return fileSize <= maxSize
}

export const esExtensionDeArchivoValida = (
  fileExtension: string,
  extensionesPermitidas: string[],
): boolean => {
  return extensionesPermitidas.includes(fileExtension)
}

export const convertirArchivoABytes = (
  file: Express.Multer.File,
): Promise<Buffer> => {
  return Promise.resolve(file.buffer)
}
