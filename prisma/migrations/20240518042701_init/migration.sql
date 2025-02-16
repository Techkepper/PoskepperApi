/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Post] DROP CONSTRAINT [Post_authorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Profile] DROP CONSTRAINT [Profile_userId_fkey];

-- DropTable
DROP TABLE [dbo].[Post];

-- DropTable
DROP TABLE [dbo].[Profile];

-- DropTable
DROP TABLE [dbo].[User];

-- CreateTable
CREATE TABLE [dbo].[Rol] (
    [idRol] INT NOT NULL IDENTITY(1,1),
    [descripcion] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Rol_pkey] PRIMARY KEY CLUSTERED ([idRol])
);

-- CreateTable
CREATE TABLE [dbo].[Usuario] (
    [idUsuario] INT NOT NULL IDENTITY(1,1),
    [fechaIngreso] DATETIME2 NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [apellidos] NVARCHAR(1000) NOT NULL,
    [nombreUsuario] NVARCHAR(1000) NOT NULL,
    [contrasenna] NVARCHAR(1000) NOT NULL,
    [idRol] INT NOT NULL,
    [comentarios] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Usuario_pkey] PRIMARY KEY CLUSTERED ([idUsuario])
);

-- CreateTable
CREATE TABLE [dbo].[Categoria] (
    [idCategoria] INT NOT NULL IDENTITY(1,1),
    [descripcion] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Categoria_pkey] PRIMARY KEY CLUSTERED ([idCategoria])
);

-- CreateTable
CREATE TABLE [dbo].[Producto] (
    [idProducto] INT NOT NULL IDENTITY(1,1),
    [fechaCreacion] DATETIME2 NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [descripcion] NVARCHAR(1000) NOT NULL,
    [foto] NVARCHAR(1000) NOT NULL,
    [idCategoria] INT NOT NULL,
    [precio] INT NOT NULL,
    [cantidad] INT NOT NULL,
    [comentario] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Producto_pkey] PRIMARY KEY CLUSTERED ([idProducto])
);

-- CreateTable
CREATE TABLE [dbo].[Cliente] (
    [idCliente] INT NOT NULL IDENTITY(1,1),
    [fechaCreacion] DATETIME2 NOT NULL,
    [cedula] BIGINT NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [apellidos] NVARCHAR(1000) NOT NULL,
    [correoElectronico] NVARCHAR(1000) NOT NULL,
    [telefono] BIGINT NOT NULL,
    [direccion] NVARCHAR(1000) NOT NULL,
    [comentario] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Cliente_pkey] PRIMARY KEY CLUSTERED ([idCliente])
);

-- CreateTable
CREATE TABLE [dbo].[Orden] (
    [idOrden] INT NOT NULL IDENTITY(1,1),
    [fechaOrden] DATETIME2 NOT NULL,
    [idUsuario] INT NOT NULL,
    [idCliente] INT NOT NULL,
    [idMesa] INT NOT NULL,
    [comentario] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Orden_pkey] PRIMARY KEY CLUSTERED ([idOrden])
);

-- CreateTable
CREATE TABLE [dbo].[DetalleOrden] (
    [idDetalleOrden] INT NOT NULL IDENTITY(1,1),
    [idOrden] INT NOT NULL,
    [idProducto] INT NOT NULL,
    [cantidad] INT NOT NULL,
    [comentario] NVARCHAR(1000) NOT NULL,
    [precioUnitario] FLOAT(53) NOT NULL,
    [total] FLOAT(53) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [DetalleOrden_pkey] PRIMARY KEY CLUSTERED ([idDetalleOrden])
);

-- CreateTable
CREATE TABLE [dbo].[Factura] (
    [idFactura] INT NOT NULL IDENTITY(1,1),
    [idOrden] INT NOT NULL,
    [fecha] DATETIME2 NOT NULL,
    [metodoPago] INT NOT NULL,
    [subtotal] FLOAT(53) NOT NULL,
    [impuesto] FLOAT(53) NOT NULL,
    [total] FLOAT(53) NOT NULL,
    [estadoFactura] BIT NOT NULL,
    [metodosPagoIdMetodo] INT,
    CONSTRAINT [Factura_pkey] PRIMARY KEY CLUSTERED ([idFactura])
);

-- CreateTable
CREATE TABLE [dbo].[Mesa] (
    [idMesa] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Mesa_pkey] PRIMARY KEY CLUSTERED ([idMesa])
);

-- CreateTable
CREATE TABLE [dbo].[Merma] (
    [idMerma] INT NOT NULL IDENTITY(1,1),
    [idProducto] INT NOT NULL,
    [cantidad] INT NOT NULL,
    [fecha] DATETIME2 NOT NULL,
    [comentario] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [Merma_pkey] PRIMARY KEY CLUSTERED ([idMerma])
);

-- CreateTable
CREATE TABLE [dbo].[MetodosPago] (
    [idMetodo] INT NOT NULL IDENTITY(1,1),
    [descripcion] NVARCHAR(1000) NOT NULL,
    [estado] BIT NOT NULL,
    CONSTRAINT [MetodosPago_pkey] PRIMARY KEY CLUSTERED ([idMetodo])
);

-- AddForeignKey
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_idRol_fkey] FOREIGN KEY ([idRol]) REFERENCES [dbo].[Rol]([idRol]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Producto] ADD CONSTRAINT [Producto_idCategoria_fkey] FOREIGN KEY ([idCategoria]) REFERENCES [dbo].[Categoria]([idCategoria]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Orden] ADD CONSTRAINT [Orden_idUsuario_fkey] FOREIGN KEY ([idUsuario]) REFERENCES [dbo].[Usuario]([idUsuario]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Orden] ADD CONSTRAINT [Orden_idCliente_fkey] FOREIGN KEY ([idCliente]) REFERENCES [dbo].[Cliente]([idCliente]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Orden] ADD CONSTRAINT [Orden_idMesa_fkey] FOREIGN KEY ([idMesa]) REFERENCES [dbo].[Mesa]([idMesa]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleOrden] ADD CONSTRAINT [DetalleOrden_idOrden_fkey] FOREIGN KEY ([idOrden]) REFERENCES [dbo].[Orden]([idOrden]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DetalleOrden] ADD CONSTRAINT [DetalleOrden_idProducto_fkey] FOREIGN KEY ([idProducto]) REFERENCES [dbo].[Producto]([idProducto]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Factura] ADD CONSTRAINT [Factura_idOrden_fkey] FOREIGN KEY ([idOrden]) REFERENCES [dbo].[Orden]([idOrden]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Factura] ADD CONSTRAINT [Factura_metodosPagoIdMetodo_fkey] FOREIGN KEY ([metodosPagoIdMetodo]) REFERENCES [dbo].[MetodosPago]([idMetodo]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Merma] ADD CONSTRAINT [Merma_idProducto_fkey] FOREIGN KEY ([idProducto]) REFERENCES [dbo].[Producto]([idProducto]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
