import { type Response } from 'express'
import path from 'path'
import PDFDocument from 'pdfkit'
import {
  IDetalleMovimientoInventario,
  type IMovimientoInventario,
} from '../src/interfaces/IMovimientoInventario'

/**
 * Genera un reporte de los movimientos de inventario por id.
 * @param movimientos - Lista de movimientos a incluir en el reporte.
 * @param res - Objeto de respuesta Express para enviar el PDF generado.
 */

export function generateReportMovimiento(
  movements: IMovimientoInventario[],
  res: Response,
) {
  const movement = movements[0]

  const doc = new PDFDocument({ margin: 50 })

  generateHeader(doc)
  generateCustomerInformation(doc, movement)
  generateInvoiceTable(doc, movement.movimientos)
  generateFooter(doc)

  doc.end()
  doc.pipe(res)
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Reporte de Movimiento de Inventario', 110, 57)
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function generateCustomerInformation(
  doc: PDFKit.PDFDocument,
  movements: IMovimientoInventario,
) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  doc.fillColor('#444444').fontSize(20).text('Detalles del Reporte', 50, 160)
  doc.fillColor('#448c22').fontSize(10).text('Fecha del reporte: ', 420, 168)
  doc.fillColor('black').text(`${currentDate}`, 510, 168)
  doc.fillColor('#448c22').fontSize(10).text('Usuario: ', 420, 185)
  doc.fillColor('black').text(`${movements.nombreCompleto}`, 480, 185)

  const fechaMovFormato = formatDate(movements.fecha)

  const lineHeight = 20

  doc
    .fillColor('#448c22')
    .fontSize(10)
    .text('Fecha del Movimiento: ', 50, 180 + lineHeight)
  doc.fillColor('black').text(`${fechaMovFormato}`, 165, 180 + lineHeight)

  doc
    .fillColor('#448c22')
    .fontSize(10)
    .text('Motivo: ', 50, 180 + lineHeight * 2)
  doc.fillColor('black').text(`${movements.motivo}`, 165, 180 + lineHeight * 2)

  doc
    .fillColor('#448c22')
    .fontSize(10)
    .text('Tipo de Movimiento: ', 50, 180 + lineHeight * 3)
  doc
    .fillColor('black')
    .text(`${movements.tipoMovimientoNombre}`, 165, 180 + lineHeight * 3)
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  c1: string,
  c2: string,
  c3: string,
  c4: string,
  c5: string,
) {
  const columnGap = 10

  doc
    .text(c1, 50, y, { width: 100, align: 'center' })
    .text(c2, 50 + 70 + columnGap, y, { width: 100, align: 'center' })
    .text(c3, 50 + 160 + 2 * columnGap, y, { width: 108, align: 'center' })
    .text(c4, 50 + 230 + 5 * columnGap, y, { width: 100, align: 'center' })
    .text(c5, 50 + 300 + 7 * columnGap, y, { width: 100, align: 'center' })
}

function generateInvoiceTable(
  doc: PDFKit.PDFDocument,
  detalles: IDetalleMovimientoInventario[],
) {
  if (!detalles || !Array.isArray(detalles)) {
    throw new Error('Invalid movements array')
  }

  const invoiceTableTop = 290

  generateTableRow(
    doc,
    invoiceTableTop,
    'Producto',
    'Cantidad Anterior',
    'Cantidad Movimiento',
    'Cantidad Actual',
    'Comentario',
  )

  drawLine(doc, invoiceTableTop + 20)

  let position = invoiceTableTop + 30

  detalles.forEach((detalle) => {
    generateTableRow(
      doc,
      position,
      detalle.nombreProducto || 'N/A',
      detalle.cantidadVieja !== undefined
        ? detalle.cantidadVieja.toString()
        : 'N/A',
      detalle.cantidadMovimiento !== undefined
        ? detalle.cantidadMovimiento.toString()
        : 'N/A',
      detalle.cantidadActual !== undefined
        ? detalle.cantidadActual.toString()
        : 'N/A',
      detalle.comentario || 'N/A',
    )
    drawLine(doc, position + 20)
    position += 30
  })
}

function drawLine(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(50, y).lineTo(550, y).stroke()
}
