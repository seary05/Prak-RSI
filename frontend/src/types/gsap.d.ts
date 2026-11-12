// Deklarasi agar TypeScript tidak error saat paket gsap belum ter-install.
// Hanya src/lib/motion.ts yang mengimpor modul ini.
declare module "gsap";