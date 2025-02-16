import { type Response } from 'express'
import path from 'path'
import PDFDocument from 'pdfkit'
import { type IProducto } from '../src/interfaces/IProducto'

/**
 * Genera un reporte de las cantidades actuales de los productos.
 * @param productos - Lista de productos a incluir en el reporte.
 * @param res - Objeto de respuesta Express para enviar el PDF generado.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateReportHastaHoy(productos: any[], res: Response) {
  const doc = new PDFDocument({ margin: 50 })

  generateHeader(doc)
  generateCustomerInformation(doc, productos.length)
  generateInvoiceTable(doc, productos)
  generateFooter(doc)

  doc.end()
  doc.pipe(res)
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Reporte de Toma Física hasta Hoy', 110, 57)
    .fontSize(10)
    .text('Poskepper Web', 200, 65, { align: 'right' })
    .text('Alajuela', 200, 80, { align: 'right' })
    .moveDown()
}

function generateFooter(doc: PDFKit.PDFDocument) {
  const pageSize = doc.page.height
  const textHeight = doc.heightOfString(
    'Generado automáticamente por el sistema de inventario.',
    {
      align: 'center',
      width: 500,
    },
  )
  const footerY = pageSize - doc.page.margins.bottom - textHeight

  doc
    .fontSize(10)
    .text(
      'Generado automáticamente por el sistema de inventario.',
      50,
      footerY,
      {
        align: 'center',
        width: 500,
      },
    )
}

function generateCustomerInformation(
  doc: PDFKit.PDFDocument,
  cantidadProductos: number,
) {
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text(`Fecha: ${new Date().toLocaleDateString()}`, 50, 160)
  doc
    .fontSize(10)
    .text(`Cantidad de productos: ${cantidadProductos}`, 50, 200)
    .moveDown()
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  c1: string,
  c2: string,
  c3: string,
  c4: string,
  c5: string,
  c6: string,
  c7: string,
) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 250, y, { width: 70, align: 'left' })
    .text(c4, 320, y, { width: 70, align: 'center' })
    .text(c5, 390, y, { width: 70 })
    .text(c6, 460, y, { width: 70 })
    .text(c7, 530, y, { width: 70 })
}

function formatCurrency(amount: number): string {
  return `${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} colones`
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, productos: IProducto[]) {
  if (!productos || !Array.isArray(productos)) {
    throw new Error('Invalid products array')
  }

  let i
  const invoiceTableTop = 250

  generateTableRow(
    doc,
    invoiceTableTop,
    'Producto',
    'Categoría',
    'Precio',
    'Cantidad Actual',
    'Comentario',
    'description',
    'Fecha de Creación',
  )

  drawLine(doc, invoiceTableTop + 20)

  for (i = 0; i < productos.length; i++) {
    const item = productos[i]
    const position = invoiceTableTop + (i + 1) * 30
    generateTableRow(
      doc,
      position,
      item.nombre,
      item.nombreCategoria || 'N/A',
      formatCurrency(item.precio),
      item.cantidad.toString(),
      item.comentario || 'N/A',
      item.descripcion || 'N/A',
      item.fechaCreacion.toLocaleDateString(),
    )

    drawLine(doc, position + 20)
  }
}

function drawLine(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(50, y).lineTo(550, y).stroke()
}
