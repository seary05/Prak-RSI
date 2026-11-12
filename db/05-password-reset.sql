USE review_kantin;
GO

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