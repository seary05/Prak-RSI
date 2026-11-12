USE review_kantin;
GO

-- Pastikan kolom yang dipakai fitur reset password ada di database lama.
IF COL_LENGTH('dbo.USERS', 'password_reset_token_hash') IS NULL
BEGIN
    ALTER TABLE dbo.USERS ADD password_reset_token_hash NVARCHAR(64) NULL;
END
GO

IF COL_LENGTH('dbo.USERS', 'password_reset_expires_at') IS NULL
BEGIN
    ALTER TABLE dbo.USERS ADD password_reset_expires_at DATETIME2(0) NULL;
END
GO

-- Buat semua akun yang sudah ada tetap bisa login dengan password default yang konsisten.
UPDATE dbo.USERS
SET password_hash = N'$2b$12$85UZTRGaBpa9itG3Z/j0A.//zYsr0LwUwLeXX0u7XHai2dq.8j.gm';
GO
