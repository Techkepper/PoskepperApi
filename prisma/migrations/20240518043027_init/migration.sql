/*
  Warnings:

  - Added the required column `idEstadoMerma` to the `Merma` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Merma] ADD [idEstadoMerma] INT NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[EstadoMerma] (
    [idEstadoMerma] INT NOT NULL IDENTITY(1,1),
    [descripcion] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [EstadoMerma_pkey] PRIMARY KEY CLUSTERED ([idEstadoMerma])
);

-- AddForeignKey
ALTER TABLE [dbo].[Merma] ADD CONSTRAINT [Merma_idEstadoMerma_fkey] FOREIGN KEY ([idEstadoMerma]) REFERENCES [dbo].[EstadoMerma]([idEstadoMerma]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
