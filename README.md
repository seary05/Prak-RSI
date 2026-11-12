# KantinReview

Aplikasi web untuk melihat warung kantin, menu, dan ulasan. Pengguna dapat mendaftar,
masuk, memberi ulasan, serta mengelola warung sesuai perannya.

## Teknologi

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Axios, dan React Router.
- **Backend:** Node.js, TypeScript, Express 5, Drizzle ORM, Zod, JWT, dan Swagger.
- **Database:** Microsoft SQL Server.

## Prasyarat

- Node.js **22.18 atau lebih baru** dan npm.
- Microsoft SQL Server yang aktif.
- `sqlcmd` untuk menjalankan skrip database.

## Instalasi dan konfigurasi

Jalankan perintah berikut dari direktori `full/`.

### 1. Siapkan database

Jika SQL Server belum mengaktifkan SQL Server Authentication, jalankan skrip berikut
dengan hak administrator. Setelah itu restart layanan SQL Server. Langkah ini hanya
diperlukan sekali dan bisa dilewati jika autentikasi SQL sudah aktif.

```powershell
sqlcmd -S localhost -E -C -i .\db\00-setup-mixed-mode.sql
```

Buat database, tabel, dan data awal:

```powershell
sqlcmd -S localhost -E -C -i .\db\01-create-database-and-user.sql
sqlcmd -S localhost -E -C -i .\db\02-schema.sql
sqlcmd -S localhost -E -C -i .\db\03-seed.sql
sqlcmd -S localhost -E -C -i .\db\04-seed-extra.sql
```

Contoh di atas memakai SQL Server default instance pada `localhost`. Sesuaikan nilai
`-S` bila menggunakan named instance, misalnya `.\SQLEXPRESS`. Pastikan kredensial
login database yang dibuat oleh skrip cocok dengan `DB_USER` dan `DB_PASSWORD` di bawah.

### 2. Siapkan file `.env`

Buat `backend/.env` dengan konfigurasi berikut. Ganti `DB_PASSWORD` dengan password
login database yang benar dan isi `JWT_SECRET` dengan nilai acak yang panjang. Jangan
commit file `.env` atau membagikan rahasianya.

```dotenv
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
DB_SERVER=localhost
DB_PORT=1433
DB_USER=praktikum_user
DB_PASSWORD=ganti-dengan-password-database
DB_NAME=review_kantin
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
JWT_SECRET=ganti-dengan-secret-acak-yang-panjang
JWT_EXPIRES_IN=2h
FRONTEND_URL=http://localhost:5173
```

Untuk mengirim tautan reset password melalui email, tambahkan konfigurasi SMTP berikut
ke `backend/.env`:

```dotenv
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
SMTP_FROM="KantinReview <no-reply@example.com>"
```

Jika SMTP tidak dikonfigurasi, lingkungan `development` menampilkan tautan reset di
halaman untuk alamat email terdaftar. Jangan gunakan perilaku ini di production. Untuk
database lama, jalankan `sqlcmd -S localhost -E -C -i .\db\05-password-reset.sql`
sebelum menggunakan fitur reset password.

Buat `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Instal dependensi

```powershell
Set-Location .\backend
npm ci
Set-Location ..\frontend
npm ci
Set-Location ..
```

## Menjalankan aplikasi

Buka dua terminal dari direktori `full/`.

Terminal pertama untuk backend:

```powershell
Set-Location .\backend
npm run dev
```

Terminal kedua untuk frontend:

```powershell
Set-Location .\frontend
npm run dev
```

Buka aplikasi di [http://localhost:5173](http://localhost:5173). Backend berjalan di
`http://localhost:3000`, dokumentasi API tersedia di `/docs`, dan pemeriksaan koneksi
database tersedia di `/health`.

## Referensi hands-on backend: Drizzle ORM

### Hands-on 2 — Akses Database dengan Drizzle ORM

Hands-on ini mengganti akses data dari query SQL manual menjadi **ORM (Drizzle)**,
tetap memakai arsitektur berlapis (Repository → Service → Controller → Router).

> Bagian ini adalah referensi implementasi hands-on backend.

## Prinsip

- **Skema DDL tetap dikelola di `../db/*.sql`** (recall ERD di SQL Server).
- Drizzle dipakai untuk **query bertipe** dari aplikasi.
- `src/db/schema.ts` **ditulis manual**, bukan hasil `drizzle-kit pull`. Alasannya:
  intropeksi (`pull`) Drizzle untuk MSSQL masih **RC** dan belum stabil.

## Prasyarat

- Node.js **>= 22.18.0**, npm
- SQL Server aktif + database sudah disiapkan:

```powershell
sqlcmd -S localhost -E -C -i ..\db\00-setup-mixed-mode.sql       # sekali saja
sqlcmd -S localhost -E -C -i ..\db\01-create-database-and-user.sql
sqlcmd -S localhost -E -C -i ..\db\02-schema.sql
sqlcmd -S localhost -E -C -i ..\db\03-seed.sql
```

---

## Langkah 1 — Buat project & install dependencies

```bash
npm init -y
npm install express mssql dotenv drizzle-orm@1.0.0-rc.5-5935859 swagger-ui-express swagger-autogen
npm install -D typescript @types/express @types/mssql @types/node tsx drizzle-kit@1.0.0-rc.5-5935859 @types/swagger-ui-express
```

> Versi `drizzle-orm`/`drizzle-kit` dipatok ke RC yang sudah diuji. Drizzle untuk MSSQL
> masih preview, jadi API bisa berubah.

### `package.json`

```json
{
  "main": "src/index.ts",
  "scripts": {
    "start": "tsx src/index.ts",
    "prestart": "npm run docs:gen",
    "dev": "tsx watch src/index.ts",
    "predev": "npm run docs:gen",
    "docs:gen": "tsx src/docs/swagger.ts"
  },
  "type": "commonjs"
}
```

## Langkah 2 — Konfigurasi `.env`

Untuk menjalankan aplikasi, buat `backend/.env` dan `frontend/.env` sesuai contoh pada
bagian [Siapkan file `.env`](#2-siapkan-file-env) di atas. Repository tidak menyediakan
file `.env.example`. Bungkus nilai yang mengandung `#` dengan tanda kutip karena dotenv
menganggapnya sebagai komentar.

## Langkah 3 — Definisikan schema (`src/db/schema.ts`)

Kita memetakan tabel SQL Server ke objek TypeScript memakai `mssqlTable` dan
builder kolom `mssql-core`.

```ts
import { mssqlTable, int, bit, nvarchar, decimal, datetime2 } from 'drizzle-orm/mssql-core';

export const users = mssqlTable('USERS', {
  id: int('id').primaryKey().identity(),
  name: nvarchar('name', { length: 100 }).notNull(),
  email: nvarchar('email', { length: 150 }).notNull().unique(),
  passwordHash: nvarchar('password_hash', { length: 255 }).notNull(),
  role: nvarchar('role', { length: 20, enum: ['admin', 'owner', 'customer'] }).notNull(),
  createdAt: datetime2('created_at'),
});

export const stalls = mssqlTable('STALLS', {
  id: int('id').primaryKey().identity(),
  ownerId: int('owner_id').notNull().references(() => users.id),
  name: nvarchar('name', { length: 100 }).notNull(),
  category: nvarchar('category', { length: 50 }),
  location: nvarchar('location', { length: 100 }),
  description: nvarchar('description', { length: 'max' }),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }).notNull(),
  reviewCount: int('review_count').notNull(),
  createdAt: datetime2('created_at'),
});

export const menuItems = mssqlTable('MENU_ITEMS', {
  id: int('id').primaryKey().identity(),
  stallId: int('stall_id').notNull().references(() => stalls.id),
  name: nvarchar('name', { length: 100 }).notNull(),
  price: int('price').notNull(),
  isAvailable: bit('is_available').notNull(),
});
```

`src/db/schema.ts` juga memuat `reviews`, `likes`, `flags`, dan `auditLogs`
(tabel lain dari ERD yang belum dipakai di hands-on ini).

## Langkah 4 — Inisialisasi koneksi (`src/db/index.ts`)

```ts
import 'dotenv/config';
import mssql from 'mssql';
import { drizzle } from 'drizzle-orm/node-mssql';
import * as schema from './schema.ts';

const config: mssql.config = {
  server: process.env.DB_SERVER ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 1433),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
  },
};

let poolPromise: Promise<mssql.ConnectionPool> | null = null;
let dbPromise: ReturnType<typeof buildDb> | null = null;

async function buildDb() {
  poolPromise ??= mssql.connect(config);
  const pool = await poolPromise;
  return drizzle({ client: pool, schema });
}

export function getDb() {
  if (!dbPromise) {
    dbPromise = buildDb().catch((error) => {
      dbPromise = null;
      poolPromise = null;
      throw error;
    });
  }
  return dbPromise;
}
```

## Langkah 5 — Repository dengan query builder

`src/repositories/stallRepository.ts`:

```ts
import { and, count, eq, like, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { stalls } from '../db/schema.ts';

export class StallRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.search) conditions.push(like(stalls.name, `%${params.search}%`));
    if (params.category) conditions.push(eq(stalls.category, params.category));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (params.page - 1) * params.limit;

    // MSSQL: pagination = ORDER BY + OFFSET ... FETCH NEXT
    const rows = await db
      .select()
      .from(stalls)
      .where(where)
      .orderBy(stalls.id)
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(stalls).where(where);

    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async create(input: CreateStallInput) {
    const db = await getDb();
    const rows = await db.insert(stalls).output().values({ /* ... */ });
    return rows[0];
  }
}
```

Join contoh (menu items) — `src/repositories/menuItemRepository.ts`:

```ts
import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems } from '../db/schema.ts';

export class MenuItemRepository {
  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }
}
```

## Langkah 6 — Service (mapping + logika bisnis)

`src/services/stallService.ts` memetakan row DB menjadi DTO camelCase dan menghitung
`isPopular` (rating ≥ 4.7). Perhatikan: `decimal` dari driver berbentuk **string**,
jadi di-`Number(...)`.

```ts
private toDto(row: StallRow): StallResponseDto {
  const avgRating = Number(row.avgRating);
  return { ...row, avgRating, isPopular: avgRating >= 4.7 };
}
```

## Langkah 7 — Controller, Router, dan Entry point

- `src/controllers/stallController.ts` — handler Express, memetakan `STALL_NOT_FOUND` → 404.
- `src/routes/stallRouter.ts` — pemetaan endpoint.
- `src/index.ts` — server Express + `GET /health` (`SELECT 1` via Drizzle).

## Langkah 8 — Jalankan & uji

```bash
npm run dev
```

| Method | Endpoint | Hasil |
| --- | --- | --- |
| GET | `/health` | `200` koneksi DB OK |
| GET | `/docs` | Swagger UI (spec hasil generate `swagger-autogen`) |
| GET | `/api/v1/stalls?search=&category=&page=&limit=` | `200` daftar + `meta {page,limit,total}` |
| GET | `/api/v1/stalls/:id` | `200` detail, `404` bila tak ada |
| GET | `/api/v1/stalls/:id/menus` | `200` daftar menu (join) |
| POST | `/api/v1/auth/forgot-password` | Minta tautan reset password melalui email |
| POST | `/api/v1/auth/reset-password` | Atur password baru dengan token sekali pakai |
| POST | `/api/v1/stalls` | `201` stall baru |
| PUT | `/api/v1/stalls/:id` | `200` stall ter-update |
| DELETE | `/api/v1/stalls/:id` | `200` stall terhapus |
| GET | `/api/v1/users` | Daftar users tanpa password hash |
| POST | `/api/v1/users` | Buat user; body memakai `name`, `email`, `password`, `role` |
| GET/POST | `/api/v1/menu-items` | Daftar menu (filter `stallId`, `page`, `limit`) / buat menu |
| GET/PUT/DELETE | `/api/v1/menu-items/:id` | Detail, ubah, atau hapus menu; response menyertakan stall |
| GET | `/api/v1/reviews?stallId=:id` | Daftar review beserta user |
| POST/DELETE | `/api/v1/reviews` / `/api/v1/reviews/:id` | Buat atau hapus review |
| POST | `/api/v1/likes` | Buat like dengan body `reviewId` dan `userId` |
| DELETE | `/api/v1/likes/:reviewId/:userId` | Hapus like |
| GET | `/api/v1/flags` | Daftar flag dengan reporter dan review |
| PUT | `/api/v1/flags/:id` | Ubah status dengan body `status`: `pending`, `resolved`, atau `dismissed` |
| GET/POST | `/api/v1/audit-logs` | Daftar atau catat audit log |

Contoh:

```bash
curl.exe "http://localhost:3000/api/v1/stalls?category=Minuman&limit=2&page=1"
```

---

## Dokumentasi API (Swagger UI)

Dokumentasi dibangun dengan **`swagger-autogen`**: ia memindai file route/entry,
mendeteksi **path + method secara otomatis**, sedangkan parameter & response ditambahkan
lewat komentar singkat `#swagger.*` di dalam handler. Hasilnya disajikan lewat
**`swagger-ui-express`** di `http://localhost:3000/docs`.

Alur:

1. `npm run docs:gen` — memindai `src/index.ts` (beserta router yang diimpor) dan
   menghasilkan `src/docs/swagger-output.json`.
2. `npm run dev` — menyajikan spec tersebut di `/docs`.
   (`predev`/`prestart` otomatis menjalankan `docs:gen` sebelum server start.)

Karena `#swagger.*` harus berada di dalam body handler, route ditulis sebagai handler
**inline** yang memanggil controller, mis.:

```ts
stallRouter.get('/', (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
  // #swagger.responses[201] = { description: 'Warung dibuat' }
  return stallController.createStall(req, res);
});
```

File terkait:

- `src/docs/swagger.ts` — definisi `info`, `servers`, `definitions.StallInput`, lalu `swaggerAutogen()(outputFile, endpointsFiles, doc)`.
- `src/docs/swagger-output.json` — **hasil generate** (di-`.gitignore`, jangan diedit manual).
- `src/routes/stallRouter.ts` — handler inline + `#swagger.parameters`/`#swagger.responses`.
- `src/index.ts` — `app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));`

Buka `/docs`, lalu klik **Try it out** untuk mengisi parameter/body dan mengirim request.
Untuk endpoint yang memerlukan autentikasi, login lewat `POST /api/v1/auth/login`,
klik **Authorize**, lalu tempel nilai `data.token` saja. Swagger UI akan mengirimkannya
dengan format `Authorization: Bearer <token>`. Jangan isi parameter header Authorization
manual pada endpoint; autentikasi diatur lewat tombol **Authorize**.

> Spec yang dihasilkan berformat **Swagger 2.0** — karena itu schema dirujuk lewat
> `#/definitions/...` (bukan `#/components/schemas/...`).

---

## Catatan penting: perbedaan API Drizzle untuk MSSQL

Bila terbiasa dengan contoh Drizzle (Postgres/MySQL), ada beberapa perbedaan:

- **Pagination**: MSSQL memakai `.orderBy(...).offset(n).fetch(m)` — **bukan** `.limit()`.
  `.offset()` wajib didahului `.orderBy()`. Ada juga `.top(n)`.
- **Mengembalikan row saat insert/update/delete**: memakai `.output()` (bukan `.returning()`).
  Untuk insert, `.output()` dipanggil **sebelum** `.values()`.
- **`decimal`** dikembalikan sebagai **string** oleh driver; konversi ke `Number` bila perlu.
- **`drizzle-kit pull`** (introspeksi) untuk MSSQL masih RC dan belum stabil, sehingga
  `schema.ts` ditulis manual dan DDL tetap di `../db/*.sql`.

## Struktur Project

```
hands-on-2-orm-drizzle/
├─ README.md
├─ .env.example
├─ drizzle.config.ts          # konfigurasi drizzle-kit (referensi)
├─ package.json  tsconfig.json
└─ src/
   ├─ db/
   │  ├─ schema.ts            # pemetaan tabel (manual)
   │  └─ index.ts            # koneksi Drizzle
   ├─ docs/
   │  ├─ swagger.ts           # generator spec (swagger-autogen)
   │  └─ swagger-output.json  # hasil generate (gitignored)
   ├─ dtos/stallDto.ts
   ├─ repositories/
   │  ├─ stallRepository.ts
   │  └─ menuItemRepository.ts
   ├─ services/stallService.ts
   ├─ controllers/stallController.ts
   ├─ routes/stallRouter.ts
   └─ index.ts
```
