'use client'

import { useRef, useState } from 'react'
import TypewriterTitle from './TypewriterTitle'
import { useLanguage } from '@/contexts/LanguageContext'

export function InternshipImageStack({
  images,
  title,
  align,
}: {
  images: string[]
  title: string
  align: 'left' | 'right'
}) {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // kartu depan "dibuang" (terlempar + memudar), lalu muncul lagi di belakang tanpa menyapu melintasi kartu lain
  const [leavingIdx, setLeavingIdx] = useState<number | null>(null)
  const [resetIdx, setResetIdx] = useState<number | null>(null)
  const busy = useRef(false)

  const goTo = (target: number) => {
    if (images.length < 2 || busy.current || target === activeIndex) return
    busy.current = true
    const leaving = activeIndex
    setLeavingIdx(leaving)
    setActiveIndex(target)
    window.setTimeout(() => {
      setLeavingIdx(null)
      setResetIdx(leaving) // lompat ke posisi belakang tanpa transisi, masih transparan
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setResetIdx(null) // lalu muncul pelan di belakang
          busy.current = false
        })
      )
    }, 430)
  }
  const handleNext = () => goTo((activeIndex + 1) % images.length)

  const isRight = align === 'right'
  const xSign = isRight ? -1 : 1
  const rotSign = isRight ? -1 : 1

  return (
    <div className="w-full relative pt-7 pb-3 px-3 select-none">
      <div
        className={`relative w-full aspect-video group ${images.length > 1 ? 'cursor-pointer' : ''}`}
        onClick={handleNext}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {images.map((img, idx) => {
          const offset = (idx - activeIndex + images.length) % images.length

          let transformStyle = ''
          let zIndex = 0
          let opacity = 0
          let filter = 'brightness(1)'

          if (offset === 0) {
            transformStyle = 'translate(0px, 0px) rotate(0deg) scale(1)'
            zIndex = 20
            opacity = 1
            filter = 'brightness(1)'
          } else if (offset === 1) {
            const tx = isHovered ? xSign * 18 : xSign * 12
            const ty = isHovered ? -18 : -12
            const rot = isHovered ? rotSign * 4 : rotSign * 2.5
            transformStyle = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0.97)`
            zIndex = 10
            opacity = 0.88
            filter = isHovered ? 'brightness(0.92)' : 'brightness(0.82)'
          } else if (offset === 2) {
            const tx = isHovered ? xSign * 34 : xSign * 24
            const ty = isHovered ? -34 : -24
            const rot = isHovered ? rotSign * 8 : rotSign * 5
            transformStyle = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(0.94)`
            zIndex = 5
            opacity = 0.72
            filter = isHovered ? 'brightness(0.82)' : 'brightness(0.68)'
          }

          // fase animasi per kartu: dibuang -> lompat ke belakang (tanpa transisi) -> normal
          let transition = 'transform 480ms cubic-bezier(0.25, 1, 0.5, 1), opacity 350ms ease, filter 350ms ease'
          if (idx === leavingIdx) {
            transformStyle = `translate(${-xSign * 150}px, -44px) rotate(${-rotSign * 15}deg) scale(0.9)`
            zIndex = 30
            opacity = 0
            filter = 'brightness(1)'
            transition = 'transform 430ms cubic-bezier(0.3, 0.7, 0.25, 1), opacity 320ms ease-in 70ms, filter 250ms ease'
          } else if (idx === resetIdx) {
            opacity = 0
            transition = 'none'
          }

          return (
            <div
              key={idx}
              className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-[var(--card-border)] bg-[var(--card-bg)] will-change-transform"
              style={{
                transform: transformStyle,
                zIndex,
                opacity,
                filter,
                transition,
              }}
            >
              <img
                src={img}
                alt={`${title} - ${t('ui.photo')} ${idx + 1}`}
                draggable={false}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          )
        })}

        {/* Floating pill: Click to shuffle next */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-40 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 dark:bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-lg">
              <span>{activeIndex + 1} / {images.length}</span>
              <span className="opacity-60">•</span>
              <span className="text-[10px] opacity-80 group-hover:opacity-100 flex items-center gap-1">
                {t('ui.changePhoto')}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        )}

        {/* Dots indicator at bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-40 flex items-center gap-1.5 pointer-events-auto">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  goTo(i)
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 bg-emerald-500 shadow-md'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`${t('ui.viewPhoto')} ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Gallery({ prefix, sectionId, imageSets, showCta }: { prefix: string; sectionId: string; imageSets: string[][]; showCta: boolean }) {
  const { t } = useLanguage()

  const internships = imageSets.map((images, i) => ({
    number: `0${i + 1}`,
    role: t(`${prefix}.${i + 1}.role`),
    institution: t(`${prefix}.${i + 1}.inst`),
    location: t(`${prefix}.${i + 1}.loc`),
    period: t(`${prefix}.${i + 1}.period`),
    subtitle: t(`${prefix}.${i + 1}.sub`),
    description: t(`${prefix}.${i + 1}.desc`),
    tags: t(`${prefix}.${i + 1}.tags`).split('|'),
    images,
    align: (i % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
  }))

  return (
    <section id={sectionId} className="relative py-24 px-4 md:px-8 overflow-hidden font-sans">
      {/* Background Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.1] z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none" stroke="currentColor">
          <path d="M0 200C300 100 400 300 720 200C1040 100 1140 300 1440 200" strokeWidth="2" />
          <path d="M0 400C300 300 400 500 720 400C1040 300 1140 500 1440 400" strokeWidth="2" />
          <path d="M0 600C300 500 400 700 720 600C1040 500 1140 700 1440 600" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-4 font-semibold font-sans">
              {t(`${prefix}.label`)}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight font-sans">
              <TypewriterTitle text={t(`${prefix}.title`)} />
            </h2>
            <p className="text-[var(--muted)] text-sm md:text-base max-w-xl font-sans">
              {t(`${prefix}.subtitle`)}
            </p>
          </div>
          {showCta && (
          <a
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--foreground)] text-[var(--background)] text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity shrink-0 w-max font-sans"
          >
            {t(`${prefix}.cta`)}
          </a>
          )}
        </div>

        {/* Alternating Story Cards with Animated Stacked Photos */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {internships.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${
                item.align === 'left' ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text Content */}
              <div className={`w-full ${item.images.length > 0 ? 'lg:w-1/2' : 'lg:w-full max-w-3xl mx-auto'} flex flex-col font-sans`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {item.number}
                  </span>
                  <span className="text-[11px] tracking-widest text-[var(--muted)] uppercase font-sans font-semibold">
                    {item.period}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-1 font-sans">
                  {item.institution}
                </h3>
                <h4 className="text-lg md:text-xl font-semibold text-emerald-500 mb-2 font-sans">
                  {item.role}
                </h4>
                <p className="text-xs md:text-sm font-semibold text-[var(--muted)] mb-5 font-sans">
                  {item.subtitle}{item.location && <> • <span className="opacity-75">{item.location}</span></>}
                </p>

                <ul className="text-[var(--muted)] text-sm leading-relaxed mb-6 font-sans flex flex-col gap-2.5">
                  {item.description.split('|').map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-3 py-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] opacity-90 font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stacked Animated Photos (dilewati bila klien tidak mengirim foto untuk tempat magang ini) */}
              {item.images.length > 0 && (
                <div className="w-full lg:w-1/2">
                  <InternshipImageStack
                    images={item.images}
                    title={item.institution}
                    align={item.align}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function WorkGallery() {
  return (
    <Gallery
      prefix="work"
      sectionId="work"
      showCta
      imageSets={[4, 3].map((count, i) => Array.from({ length: count }, (_, m) => `/galeri/work-${i + 1}-${m + 1}.jpg`))}
    />
  )
}

export function OrgActivities() {
  const { t } = useLanguage()
  const [hoveredOrgId, setHoveredOrgId] = useState<number | null>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const photos = ['/galeri/org-1-1.jpg', '/galeri/org-1-2.jpg', '/galeri/org-1-3.jpg']

  const organizations = [1].map((n) => ({
    id: n,
    role: t(`org.${n}.role`),
    institution: t(`org.${n}.inst`),
    location: t(`org.${n}.loc`),
    period: t(`org.${n}.period`),
    description: t(`org.${n}.desc`),
    tags: t(`org.${n}.tags`).split('|'),
  }))

  const getPhotoWrapperClass = (photoOrgIds: number[]) => {
    const isMatch = hoveredOrgId !== null && photoOrgIds.includes(hoveredOrgId)
    const isDimmed = hoveredOrgId !== null && !isMatch
    if (isMatch) {
      return 'ring-2 ring-emerald-500 shadow-2xl scale-105 z-20 border-emerald-500/60 opacity-100'
    }
    if (isDimmed) {
      return 'opacity-35 scale-[0.96] border-[var(--card-border)]/50'
    }
    return 'opacity-90 scale-100 hover:opacity-100 hover:scale-105 border-[var(--card-border)] shadow-md'
  }

  const getPhotoImageClass = (photoOrgIds: number[]) => {
    const isMatch = hoveredOrgId !== null && photoOrgIds.includes(hoveredOrgId)
    if (isMatch) {
      return 'grayscale-0 brightness-105 contrast-105 scale-105'
    }
    return 'grayscale hover:grayscale-0'
  }

  const tile = 'w-full bg-[var(--card-bg)] rounded-2xl overflow-hidden border transition-all duration-500 cursor-pointer relative group'
  const hoverProps = {
    onMouseEnter: () => setHoveredOrgId(1),
    onMouseLeave: () => setHoveredOrgId(null),
  }

  return (
    <section id="organisation" className="relative py-24 px-4 md:px-8 overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.1] z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none" stroke="currentColor">
          <path d="M0 200C300 100 400 300 720 200C1040 100 1140 300 1440 200" strokeWidth="2" />
          <path d="M0 400C300 300 400 500 720 400C1040 300 1140 500 1440 400" strokeWidth="2" />
          <path d="M0 600C300 500 400 700 720 600C1040 500 1140 700 1440 600" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[var(--muted)] mb-4 font-semibold font-sans">{t('org.label')}</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-sans">
              <TypewriterTitle text={t('org.title')} />
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--card-bg)] border border-[var(--card-border)] text-xs font-semibold tracking-wider text-[var(--muted)] shrink-0 w-max font-sans">
            {t('org.campus')}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Kiri: kolase foto */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-3 sm:gap-4 pr-0 lg:pr-4 lg:sticky lg:top-24 select-none">
            <div className="flex flex-col gap-3 sm:gap-4 -translate-y-4">
              <div
                {...hoverProps}
                onClick={() => setActiveIdx((prev) => (prev + 1) % photos.length)}
                className={`${tile} aspect-[4/5] ${getPhotoWrapperClass([1])}`}
                title={t('ui.orgClick')}
              >
                <img src={photos[activeIdx]} alt={t('org.1.inst')} className={`w-full h-full object-cover transition-all duration-500 ${getPhotoImageClass([1])}`} />
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[9px] font-medium flex items-center gap-1 shadow-md pointer-events-none">
                  <span>{activeIdx + 1}/{photos.length}</span>
                  <span className="opacity-60">•</span>
                  <span>{t('org.badge')}</span>
                </div>
              </div>

              <div {...hoverProps} className={`${tile} aspect-square ${getPhotoWrapperClass([1])}`}>
                <img src="/galeri/org-1-6.jpg" alt={t('org.1.inst')} className={`w-full h-full object-cover transition-all duration-500 ${getPhotoImageClass([1])}`} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 translate-y-3">
              <div {...hoverProps} className={`${tile} aspect-square ${getPhotoWrapperClass([1])}`}>
                <img src="/galeri/org-1-4.jpg" alt={t('org.1.inst')} className={`w-full h-full object-cover transition-all duration-500 ${getPhotoImageClass([1])}`} />
              </div>
              <div
                {...hoverProps}
                onClick={() => { setActiveIdx(1); setHoveredOrgId(1) }}
                className={`${tile} aspect-[4/5] ${getPhotoWrapperClass([1])}`}
              >
                <img src={photos[1]} alt={t('org.1.inst')} className={`w-full h-full object-cover transition-all duration-500 ${getPhotoImageClass([1])}`} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 -translate-y-6">
              <div
                {...hoverProps}
                onClick={() => { setActiveIdx(2); setHoveredOrgId(1) }}
                className={`${tile} aspect-[4/5] ${getPhotoWrapperClass([1])}`}
              >
                <img src={photos[2]} alt={t('org.1.inst')} className={`w-full h-full object-cover transition-all duration-500 ${getPhotoImageClass([1])}`} />
              </div>
              <div {...hoverProps} className={`${tile} aspect-square ${getPhotoWrapperClass([1])}`}>
                <img src="/galeri/org-1-5.jpg" alt={t('org.1.inst')} className={`w-full h-full object-cover transition-all duration-500 ${getPhotoImageClass([1])}`} />
              </div>
            </div>
          </div>

          {/* Kanan: kartu organisasi */}
          <div className="lg:col-span-7 flex flex-col gap-4 font-sans">
            {organizations.map((item) => {
              const isSelected = hoveredOrgId === item.id
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredOrgId(item.id)}
                  onMouseLeave={() => setHoveredOrgId(null)}
                  className={`group p-6 rounded-3xl bg-[var(--card-bg)] border transition-all duration-300 shadow-sm flex flex-col font-sans cursor-pointer ${
                    isSelected ? 'border-emerald-500/70 shadow-lg -translate-y-1 ring-1 ring-emerald-500/30' : 'border-[var(--card-border)] hover:border-[var(--muted)]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-[var(--background)] border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : 'border-[var(--card-border)] text-[var(--muted)] group-hover:text-[var(--foreground)]'
                        }`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className={`font-bold text-base sm:text-lg transition-colors font-sans ${isSelected ? 'text-emerald-500' : 'text-[var(--foreground)] group-hover:text-emerald-500'}`}>
                          {item.institution}
                        </h3>
                        <p className="text-xs font-semibold text-[var(--muted)] font-sans">
                          {item.role} • <span className="opacity-75">{item.location}</span>
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-sans tracking-wider px-2.5 py-1 rounded-full border self-start sm:self-auto shrink-0 font-medium transition-colors ${
                        isSelected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-[var(--background)] border-[var(--card-border)] text-[var(--muted)]'
                      }`}
                    >
                      {item.period}
                    </span>
                  </div>

                  <p className="text-[var(--muted)] text-xs sm:text-sm leading-relaxed mb-4 mt-2 font-sans">{item.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]/50">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] px-2 py-0.5 rounded-md border font-medium font-sans transition-colors ${
                            isSelected ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-[var(--background)] border-[var(--card-border)] text-[var(--muted)]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 pt-3 border-t border-[var(--card-border)]/40">
                    <span className="text-[10px] text-[var(--muted)] font-semibold uppercase tracking-wider font-sans">{t('ui.orgDocs')}</span>
                    <div className="flex items-center gap-2">
                      {photos.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveIdx(i)
                            setHoveredOrgId(1)
                          }}
                          className={`w-12 h-8 rounded-lg overflow-hidden border transition-all duration-300 ${
                            activeIdx === i ? 'border-emerald-500 ring-2 ring-emerald-500/50 scale-105 shadow-md' : 'border-[var(--card-border)] opacity-70 hover:opacity-100 hover:scale-105'
                          }`}
                          title={`${t('ui.orgView')} ${i + 1}`}
                        >
                          <img src={img} alt={`${t('org.badge')} ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
