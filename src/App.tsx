import { useEffect, useRef, useState } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4'
const CONTACT_EMAIL = 'mahodibilla106@gmail.com'
const TYPEWRITER_TEXT =
  'Glad you stopped in. Good taste tends to find us. Now, what are we building?'
const NAV_LINKS = ['Labs', 'Studio', 'Openings', 'Shop']
const ACTIONS = [
  'Pitch us an idea',
  'Come work here',
  'Send a brief hello',
  'See how we operate',
]
const PROMPT_STEPS = [
  {
    number: '01',
    title: 'Project setup',
    description: 'Start with a solid foundation using React, TypeScript, Vite, and Tailwind.',
    prompt: `Create a new, production-ready creative-agency landing page project using React, TypeScript, Vite, and Tailwind CSS. Set up a clean, minimal project structure with reusable components, strict TypeScript, and working development and production build scripts. Do not add UI libraries. First show me the proposed file structure, then implement the setup. Make sure the project starts and builds successfully.`,
  },
  {
    number: '02',
    title: 'Visual direction & fonts',
    description: 'Set the color palette, typography, and overall visual style.',
    prompt: `Set up the visual foundation for this creative-agency website. Load HelveticaNowDisplay-Medium for headings and HelveticaNowDisplayW01-Rg for body text using their stylesheet URLs in index.html. Define --font-heading and --font-body in index.css, and use the body font everywhere except the wordmark. Create a restrained black-and-white palette with one vivid lime accent, accessible contrast, responsive spacing, and a subtle reduced-motion fallback. Keep the design editorial, polished, and minimal.`,
  },
  {
    number: '03',
    title: 'Video hero',
    description: 'Add a full-screen video background with mouse-controlled scrubbing.',
    prompt: `Build a full-viewport hero for the agency landing page. Use this background video: https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4. Keep it fixed, muted, inline, preloaded, and do not autoplay. Scrub its currentTime forward or backward from horizontal mouse movement, clamp to the video duration, and queue another seek after seeked instead of flooding the video with seeks. Add a restrained overlay so white text stays readable. Handle metadata not being ready yet.`,
  },
  {
    number: '04',
    title: 'Navigation & menu',
    description: 'Build desktop links, a mobile hamburger, and an accessible overlay.',
    prompt: `Add a fixed, responsive navigation over the hero. On desktop, show the agency wordmark at left, four centered text links separated by commas, and an underlined contact link at right. Below the medium breakpoint, replace desktop navigation with a three-bar hamburger button. Animate it into a close icon and open a full-screen dark, blurred menu overlay with the same links. Include accessible labels and aria-expanded, close the menu when a link is selected, and prevent hidden menu links from receiving keyboard focus.`,
  },
  {
    number: '05',
    title: 'Content & interactions',
    description: 'Add the typewriter, calls to action, copy button, and prompt guide.',
    prompt: `Finish the page content and interactions. Add a blurred two-line greeting and a typewriter paragraph with a 600ms initial delay, 38ms per character, and a blinking cursor that disappears when typing finishes. Reveal four white pill calls to action with a short fade-and-slide animation after 400ms, independent of typing. Add an outlined email pill that copies the address to the clipboard. Below the hero, add a Bengali-language, six-step prompt guide with individually copyable English prompts. Use semantic HTML and keep every section responsive.`,
  },
  {
    number: '06',
    title: 'Test, README & GitHub',
    description: 'Check every screen and prepare the documented project for publishing.',
    prompt: `Review the complete project for TypeScript errors, broken links, horizontal overflow, inaccessible controls, and mobile layout issues. Run the existing production build and fix any issues caused by this project. Write a useful README.md with the project overview, feature list, tech stack, prerequisites, install/dev/build commands, customization notes (including how to replace the video and agency name), and clear steps for publishing the repository to GitHub and deploying the built site. Never include secrets or personal credentials. Summarize the files changed and commands verified.`,
  },
]

function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let characterIndex = 0
    let interval: number | undefined
    const delayTimeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        characterIndex += 1
        setDisplayed(text.slice(0, characterIndex))

        if (characterIndex >= text.length) {
          window.clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(delayTimeout)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [speed, startDelay, text])

  return { displayed, done }
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-3 w-3 shrink-0"
      fill="none"
      viewBox="0 0 12 12"
    >
      <rect
        x="3.5"
        y="1.5"
        width="7"
        height="8"
        rx="1"
        stroke="currentColor"
      />
      <path
        d="M8.5 9.5v1H2a1 1 0 0 1-1-1V3h1"
        stroke="currentColor"
      />
    </svg>
  )
}

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTimeRef = useRef(0)
  const copyTimeoutRef = useRef<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [actionsVisible, setActionsVisible] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT)

  useEffect(() => {
    const revealTimeout = window.setTimeout(() => setActionsVisible(true), 400)
    return () => window.clearTimeout(revealTimeout)
  }, [])

  useEffect(
    () => () => {
      if (copyTimeoutRef.current !== null) {
        window.clearTimeout(copyTimeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    let prevX: number | null = null
    const sensitivity = 0.8

    const seekToTarget = () => {
      const video = videoRef.current
      if (!video || video.seeking || !Number.isFinite(video.duration)) return

      const difference = targetTimeRef.current - video.currentTime
      if (Math.abs(difference) > 0.01) {
        video.currentTime = targetTimeRef.current
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const video = videoRef.current
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
        prevX = event.clientX
        return
      }

      if (prevX !== null) {
        const delta = event.clientX - prevX
        targetTimeRef.current = Math.min(
          video.duration,
          Math.max(
            0,
            targetTimeRef.current +
              (delta / window.innerWidth) * sensitivity * video.duration,
          ),
        )
        seekToTarget()
      }
      prevX = event.clientX
    }

    window.addEventListener('mousemove', handleMouseMove)
    videoRef.current?.addEventListener('seeked', seekToTarget)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      videoRef.current?.removeEventListener('seeked', seekToTarget)
    }
  }, [])

  const copyEmail = () => {
    void navigator.clipboard.writeText(CONTACT_EMAIL)
  }

  const copyPrompt = async (number: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt)
    setCopiedPrompt(number)
    if (copyTimeoutRef.current !== null) {
      window.clearTimeout(copyTimeoutRef.current)
    }
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopiedPrompt(null)
      copyTimeoutRef.current = null
    }, 1600)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101010]">
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center]"
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedMetadata={(event) => {
          targetTimeRef.current = event.currentTarget.currentTime
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-gradient-to-r from-black/45 via-black/10 to-black/5"
      />

      <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        <a
          aria-label="MC Mahodi home"
          className="flex items-center gap-3 whitespace-nowrap text-white"
          href="#"
        >
          <span className="font-[var(--font-heading)] text-[21px] tracking-tight sm:text-[26px]">
            MC Mahodi
          </span>
          <span
            aria-hidden="true"
            className="select-none text-[25px] leading-none tracking-[-0.02em] [filter:brightness(0)_invert(1)] sm:text-[30px]"
          >
            ✳︎
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center text-[23px] text-white md:absolute md:left-1/2 md:flex md:-translate-x-1/2"
        >
          {NAV_LINKS.map((link, index) => (
            <span key={link}>
              <a
                className="transition-opacity hover:opacity-60"
                href={`#${link.toLowerCase()}`}
              >
                {link}
              </a>
              {index < NAV_LINKS.length - 1 && ', '}
            </span>
          ))}
        </nav>

        <a
          className="hidden text-[23px] text-white underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
          href={`mailto:${CONTACT_EMAIL}`}
        >
          Get in touch
        </a>

        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="z-20 flex flex-col gap-[5px] p-1 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span
            className={`h-[2px] w-6 bg-white transition-transform duration-300 ${
              menuOpen ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-white transition-opacity duration-300 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-white transition-transform duration-300 ${
              menuOpen ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </header>

      <nav
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-black/90 px-8 text-[32px] font-medium text-white backdrop-blur-md transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            className="w-fit"
            href={`#${link.toLowerCase()}`}
            key={link}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {link}
          </a>
        ))}
        <a
          className="w-fit underline underline-offset-4"
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={() => setMenuOpen(false)}
          tabIndex={menuOpen ? 0 : -1}
        >
          Get in touch
        </a>
      </nav>

      <section className="relative z-[1] flex h-screen min-h-[560px] flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
        <div className="relative z-10 max-w-xl">
          <p className="pointer-events-none mb-5 select-none text-[clamp(18px,4vw,26px)] font-normal leading-[1.3] text-white [filter:blur(4px)] sm:mb-6">
            Hey there, meet A.R.I.A,
            <br />
            MC Mahodi&apos;s Adaptive Response Interface Agent
          </p>

          <p className="mb-5 min-h-[54px] text-[clamp(18px,4vw,26px)] font-normal leading-[1.35] text-white sm:mb-6">
            {displayed}
            {!done && (
              <span
                aria-hidden="true"
                className="typewriter-cursor ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-white"
              />
            )}
          </p>

          <div
            className={`flex flex-wrap gap-y-1 transition-[opacity,transform] duration-[400ms] ease-out ${
              actionsVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
          >
            {ACTIONS.map((action) => (
              <a
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
                href={`mailto:${CONTACT_EMAIL}`}
                key={action}
              >
                {action}
              </a>
            ))}

            <button
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
              onClick={copyEmail}
              type="button"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">
                  {CONTACT_EMAIL}
                </span>
              </span>
              <CopyIcon />
            </button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="studio-heading"
        className="relative z-[1] overflow-hidden bg-[linear-gradient(145deg,#a31337_0%,#79102d_48%,#4c0d21_100%)] px-5 py-20 text-white sm:px-8 sm:py-28 md:px-10 md:py-36"
        id="studio"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/55 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#d8ff62]" />
            The project, step by step
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">A prompt playbook</span>
          </div>

          <h2
            className="mt-8 max-w-5xl text-[clamp(44px,8vw,112px)] leading-[0.96] tracking-[-0.055em]"
            id="studio-heading"
          >
            From one idea to{' '}
            <span className="text-[#d8ff62]">a complete project.</span>
          </h2>

          <div className="mt-8 flex flex-col justify-between gap-6 border-b border-white/15 pb-12 sm:mt-10 sm:flex-row sm:items-end sm:pb-16">
            <p className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
              Build a project like this one from the first setup step to
              publishing on GitHub. Use one prompt at a time, check each result,
              then move on to the next step.
            </p>
            <span className="w-fit whitespace-nowrap border-b border-[#d8ff62]/50 pb-2 text-sm text-[#d8ff62] sm:text-base">
              06 steps <span aria-hidden="true">↘</span>
            </span>
          </div>

          <div className="mt-8 space-y-3 sm:mt-12 sm:space-y-4">
            {PROMPT_STEPS.map((step) => (
              <article
                className="group grid gap-5 border border-white/15 bg-[#390b1b]/35 p-5 transition-colors duration-300 hover:border-white/25 hover:bg-[#390b1b]/55 sm:p-7 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[240px_minmax(0,1fr)]"
                key={step.number}
              >
                <div className="flex items-start gap-4 md:flex-col md:justify-between">
                  <span className="font-mono text-sm tracking-wide text-[#d8ff62]">
                    {step.number} <span className="text-white/30">/ 06</span>
                  </span>
                  <div>
                    <h3 className="text-xl tracking-[-0.03em] sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/35 sm:text-xs">
                      Copy this prompt
                    </span>
                    <button
                      aria-label={
                        copiedPrompt === step.number
                          ? `Prompt for step ${step.number} copied`
                          : `Copy prompt for step ${step.number}`
                      }
                      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-[#d8ff62]/60 hover:text-[#d8ff62]"
                      onClick={() => void copyPrompt(step.number, step.prompt)}
                      type="button"
                    >
                      {copiedPrompt === step.number ? 'Copied' : 'Copy prompt'}
                      <CopyIcon />
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-white/75 sm:text-sm">
                    {step.prompt}
                  </pre>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.16em] text-white/40 sm:mt-16 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
            <span>One prompt at a time · Build and check every step</span>
            <span>Designed to build, ready to share</span>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
