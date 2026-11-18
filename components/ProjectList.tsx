'use client'

import { useLanguage } from '@/contexts/LanguageContext'

const palette = ['bg-emerald-600', 'bg-blue-600', 'bg-teal-600', 'bg-indigo-600', 'bg-cyan-700', 'bg-purple-600', 'bg-amber-600', 'bg-teal-700']
const colorFor = (tech: string) => palette[tech.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length]

const projects = [
  {
    number: '01',
    title: { id: "SPT Masa melalui Coretax", en: "Monthly Tax Returns via Coretax" },
    description: { id: "Menyusun dan melaporkan SPT Masa meliputi PPh Pasal 21, PPh Pasal 23, PPh Final Pasal 4 Ayat (2), serta PPN.", en: "Preparing and filing monthly returns covering PPh Article 21, PPh Article 23, Final PPh Article 4(2), and VAT." },
    framework: "KPMG INDONESIA 2026",
    techStack: ["SPT Masa", "Coretax"],
  },
  {
    number: '02',
    title: { id: "SPT Tahunan Badan & Orang Pribadi", en: "Annual Corporate & Individual Tax Returns" },
    description: { id: "Mendukung penyusunan dan pelaporan SPT Tahunan Badan serta SPT Tahunan Orang Pribadi.", en: "Supporting the preparation and filing of annual corporate and individual tax returns." },
    framework: "KPMG INDONESIA 2026",
    techStack: ["SPT Tahunan", "PPh"],
  },
  {
    number: '03',
    title: { id: "Pengecekan Data & Dokumen Pajak", en: "Tax Data & Document Checks" },
    description: { id: "Memeriksa data dan kelengkapan dokumen perpajakan sebelum proses pelaporan.", en: "Checking tax data and document completeness before the reporting process." },
    framework: "KPMG INDONESIA 2026",
    techStack: ["Verifikasi", "Dokumen"],
  },
  {
    number: '04',
    title: { id: "Administrasi Pajak Berbasis Coretax", en: "Coretax-Based Tax Administration" },
    description: { id: "Menangani administrasi perpajakan di Coretax dan mempelajari penerapannya pada berbagai jenis wajib pajak.", en: "Handling tax administration in Coretax and learning how it applies to different taxpayer types." },
    framework: "KPMG INDONESIA 2026",
    techStack: ["Coretax", "Wajib Pajak"],
  },
  {
    number: '05',
    title: { id: "Dokumen & Kepatuhan Pajak Klien", en: "Client Tax Documents & Compliance" },
    description: { id: "Membantu tim mengelola dokumen dan administrasi kepatuhan perpajakan klien.", en: "Helping the team manage client documents and tax compliance administration." },
    framework: "KPMG INDONESIA 2026",
    techStack: ["Kepatuhan", "Administrasi"],
  },
  {
    number: '06',
    title: { id: "Input & Verifikasi Transfer", en: "Transfer Input & Verification" },
    description: { id: "Input dan verifikasi data transaksi incoming transfer dan outgoing transfer.", en: "Entering and verifying incoming and outgoing transfer transaction data." },
    framework: "BCA 2024",
    techStack: ["Treasury", "Transfer"],
  },
  {
    number: '07',
    title: { id: "50+ Surat Masuk per Hari", en: "50+ Incoming Letters per Day" },
    description: { id: "Mengelola administrasi surat masuk melalui sistem internal perbankan.", en: "Managing incoming letter administration through the bank's internal system." },
    framework: "BCA 2024",
    techStack: ["Administrasi", "Sistem Internal"],
  },
  {
    number: '08',
    title: { id: "Pelaporan Treasury 100% Akurat", en: "100% Accurate Treasury Reporting" },
    description: { id: "Membantu pelaporan dan dokumentasi transaksi treasury dengan akurasi data 100%.", en: "Helping with treasury reporting and documentation with 100% data accuracy." },
    framework: "BCA 2024",
    techStack: ["Pelaporan", "Akurasi"],
  },
  {
    number: '09',
    title: { id: "Pengembangan Minat dan Bakat Mahasiswa", en: "Student Interest & Talent Development" },
    description: { id: "Mengkoordinasikan kegiatan pengembangan minat dan bakat mahasiswa sesuai target dan jadwal.", en: "Coordinating student interest and talent development activities on target and on schedule." },
    framework: "BEM UGM 2024",
    techStack: ["Koordinasi", "Organisasi"],
  },
  {
    number: '10',
    title: { id: "Juara 1 National Accounting Competition", en: "1st Place, National Accounting Competition" },
    description: { id: "Juara 1 kompetisi akuntansi nasional yang diselenggarakan Ikatan Akuntan Indonesia.", en: "First place in the national accounting competition organised by Ikatan Akuntan Indonesia." },
    framework: "IKATAN AKUNTAN INDONESIA 2025",
    techStack: ["Akuntansi", "Juara 1"],
  },
]

export default function ProjectList() {
  const { lang } = useLanguage()
  const en = lang === 'en'

  return (
    <section id="technical" className="py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-3">{en ? 'FINANCE, ACCOUNTING & TAX PORTFOLIO' : 'PORTOFOLIO FINANCE, AKUNTANSI & PAJAK'}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-3">{en ? 'Tax, Treasury, Accounting & Competition Work' : 'Pekerjaan Pajak, Treasury, Akuntansi & Kompetisi'}</h2>
          <p className="text-[var(--muted)] text-sm max-w-lg">
            {en
              ? 'A record of tax compliance, treasury operations, student leadership, and competition achievements.'
              : 'Rekam jejak kepatuhan pajak, operasional treasury, kepemimpinan mahasiswa, dan pencapaian kompetisi.'}
          </p>
        </div>

        <div className="divide-y divide-[var(--card-border)]">
          {projects.map((project) => (
            <div
              key={project.number}
              className="group flex items-start gap-4 md:gap-8 py-6 hover:bg-[var(--card-bg)] hover:px-4 rounded-lg transition-all duration-300"
            >
              <span className="text-[var(--muted)] text-sm font-semibold mt-1 shrink-0 w-8 font-sans">{project.number}</span>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-1">{project.title[lang]}</h3>
                <p className="text-[var(--muted)] text-sm mb-2 leading-relaxed">{project.description[lang]}</p>
                <p className="text-[var(--muted)] text-xs tracking-wider uppercase mb-3 font-semibold">{project.framework}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {project.techStack.map((tech) => (
                    <span key={tech} className={`px-2.5 py-1 rounded-md text-white text-[10px] font-semibold tracking-wide ${colorFor(tech)}`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors mt-1 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
