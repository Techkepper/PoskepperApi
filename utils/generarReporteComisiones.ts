import { type Response } from 'express'
import path from 'path'
import PDFDocument from 'pdfkit'

export interface Comision {
  idFactura: number
  idUsuario: number
  Total: number
  Comision: number
  Nombre: string
  Apellidos: string
  Correo: string
  ComisionUsuario: number
  DescripcionRol: string
  FechaInicio: Date
  FechaFin: Date
}

export function generateReportComisionesMesero(
  comisiones: Comision[],
  res: Response,
) {
  const doc = new PDFDocument({ margin: 50 })

  generateHeader(doc)
  generateMeseroInformation(doc, comisiones)
  generateFooter(doc)

  res.setHeader('Content-Type', 'application/pdf')
  doc.pipe(res)
  doc.end()
}

function generateHeader(doc: PDFKit.PDFDocument) {
  doc
    .image(path.join(__dirname, '../assets/logo.png'), 50, 45, { width: 50 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Reporte de Comisiones', 110, 57)
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

function generateMeseroInformation(
  doc: PDFKit.PDFDocument,
  comisiones: Comision[],
) {
  const tableTop = 200
  const rowHeight = 20

  const pageWidth = doc.page.width
  const tableWidth = 400
  const tableLeft = (pageWidth - tableWidth) / 2

  doc
    .fillColor('#444444')
    .font('Helvetica-Oblique')
    .fontSize(12)
    .text(
      `Comisiones generadas entre: ${comisiones[0].FechaInicio.toLocaleDateString()} - ${comisiones[0].FechaFin.toLocaleDateString()}`,
      tableLeft,
      tableTop - 100,
    )
  doc.text(`Correo: ${comisiones[0].Correo}`, tableLeft, tableTop - 55)
  doc.text(
    `Comisión por Factura: ${comisiones[0].ComisionUsuario}%`,
    tableLeft,
    tableTop - 40,
  )

  generateTableHeader(doc, tableTop, tableLeft, tableWidth)

  comisiones.forEach((comision, index) => {
    const y = tableTop + rowHeight + (index + 1) * rowHeight
    generateTableRow(
      doc,
      y,
      tableLeft,
      tableWidth,
      comision.idFactura,
      formatCurrency(comision.Total),
      formatCurrency(comision.Comision),
    )
  })
}

function generateTableHeader(
  doc: PDFKit.PDFDocument,
  y: number,
  tableLeft: number,
  tableWidth: number,
) {
  const columnWidth = tableWidth / 3
  doc
    .fontSize(10)
    .text('Número de Factura', tableLeft, y, {
      width: columnWidth,
      align: 'center',
    })
    .text('Total', tableLeft + columnWidth, y, {
      width: columnWidth,
      align: 'center',
    })
    .text('Comisión', tableLeft + 2 * columnWidth, y, {
      width: columnWidth,
      align: 'center',
    })
    .moveTo(tableLeft, y + 15)
    .lineTo(tableLeft + tableWidth, y + 15)
    .stroke()
}

function generateTableRow(
  doc: PDFKit.PDFDocument,
  y: number,
  tableLeft: number,
  tableWidth: number,
  idFactura: number,
  total: string,
  comision: string,
) {
  const columnWidth = tableWidth / 3
  doc
    .fontSize(10)
    .text(idFactura.toString(), tableLeft, y, {
      width: columnWidth,
      align: 'center',
    })
    .text(total, tableLeft + columnWidth, y, {
      width: columnWidth,
      align: 'center',
    })
    .text(comision, tableLeft + 2 * columnWidth, y, {
      width: columnWidth,
      align: 'center',
    })
}

function formatCurrency(amount: number): string {
  return `${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} colones`
}
