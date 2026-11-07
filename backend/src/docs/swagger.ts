import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  security: [{ bearerAuth: [] }],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Tempel token dari login; awalan Bearer ditambahkan otomatis.',
    },
  },
  definitions: {
    StallInput: {
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: 'Warung makan siang',
    },
    RegisterInput: {
      $name: 'Nama Pengguna',
      $email: 'customer@example.com',
      $password: 'password123',
    },
    LoginInput: {
      $email: 'customer@example.com',
      $password: 'password123',
    },
    UserInput: {
      $name: 'Nama Pengguna',
      $email: 'owner@example.com',
      $password: 'password123',
      $role: 'owner',
    },
    MenuItemInput: {
      $stallId: 1,
      $name: 'Nasi Goreng',
      $price: 15000,
      isAvailable: true,
    },
    ReviewInput: {
      $stallId: 1,
      $rating: 5,
      comment: 'Enak!',
    },
    LikeInput: {
      $reviewId: 1,
    },
    FlagInput: {
      $status: 'resolved',
    },
    AuditInput: {
      $action: 'review.flagged',
      $targetTable: 'REVIEWS',
      $targetId: 1,
      metadata: { reason: 'Spam' },
    },
    ErrorResponse: {
      $status: 'fail',
      $message: 'Validasi gagal',
      errors: [{ field: 'name', message: 'name minimal 3 karakter' }],
    },
  },
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen({ autoHeaders: false })(outputFile, endpointsFiles, doc);
