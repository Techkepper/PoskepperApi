import { type Response } from 'express'
import path from 'path'
import PDFDocument from 'pdfkit'
import { type IProducto } from '../src/interfaces/IProducto'

/**
 * Genera un reporte de las diferencias entre la cantidad actual y la cantidad anterior de los productos.
 * @param productos - Lista de productos a incluir en el reporte.
 * @param res - Objeto de respuesta Express para enviar el PDF generado.
 */
export function generateReport(products: IProducto[], res: Response) {
  const doc = new PDFDocument({ margin: 50 })

  generateHeader(doc)
  generateCustomerInformation(doc)
  generateInvoiceTable(doc, products)
  generateFooter(doc)

  doc.end()
  doc.pipe(res)
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Reporte de Toma Física', 110, 57)
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

function generateCustomerInformation(doc: PDFKit.PDFDocument) {
  doc.fillColor('#444444').fontSize(20).text('Detalles del Reporte', 50, 160)

  const currentDate = new Date().toLocaleDateString()
  doc.fontSize(10).text(`Fecha del reporte: ${currentDate}`, 50, 200).moveDown()
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
) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 250, y, { width: 70, align: 'right' })
    .text(c4, 320, y, { width: 70, align: 'right' })
    .text(c5, 390, y, { width: 70, align: 'right' })
    .text(c6, 460, y, { width: 70, align: 'right' })
}

function formatCurrency(amount: number): string {
  return `${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} colones`
}

function generateInvoiceTable(doc: PDFKit.PDFDocument, products: IProducto[]) {
  if (!products || !Array.isArray(products)) {
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
    'Cantidad Anterior',
    'Diferencia',
  )

  drawLine(doc, invoiceTableTop + 20)

  for (i = 0; i < products.length; i++) {
    const item = products[i]
    const position = invoiceTableTop + (i + 1) * 30
    const diferencia = (item.cantidad - (item.cantidadVieja || 0)).toString()
    generateTableRow(
      doc,
      position,
      item.nombre,
      item.nombreCategoria || 'N/A',
      formatCurrency(item.precio),
      item.cantidad.toString(),
      item.cantidadVieja ? item.cantidadVieja.toString() : 'N/A',
      diferencia,
    )

    drawLine(doc, position + 20)
  }
}

function drawLine(doc: PDFKit.PDFDocument, y: number) {
  doc.moveTo(50, y).lineTo(550, y).stroke()
}
