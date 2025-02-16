/*
  Warnings:

  - A unique constraint covering the columns `[nombreUsuario]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[Usuario] ADD CONSTRAINT [Usuario_nombreUsuario_key] UNIQUE NONCLUSTERED ([nombreUsuario]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
