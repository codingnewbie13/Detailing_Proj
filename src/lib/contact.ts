// Contact helpers — open WhatsApp with a prefilled message, or the phone dialer.
// Also a tiny shared setting for WhatsApp mode: 'auto' (API automation) vs 'manual'.

import { useState, useEffect } from 'react'

const WA_MODE_KEY = 'lustre_wa_mode'

export type WaMode = 'auto' | 'manual'

export function getWaMode(): WaMode {
  if (typeof localStorage === 'undefined') return 'auto'
  return (localStorage.getItem(WA_MODE_KEY) as WaMode) || 'auto'
}

export function setWaMode(mode: WaMode) {
  localStorage.setItem(WA_MODE_KEY, mode)
  window.dispatchEvent(new CustomEvent('lustre-wa-mode', { detail: mode }))
}

/** Strip a phone number down to digits with country code (no +, spaces, dashes). */
export function normalizePhone(phone: string): string {
  let d = phone.replace(/[^\d]/g, '')
  // If it looks like a local 10-digit Indian number, prefix 91.
  if (d.length === 10) d = '91' + d
  return d
}

/**
 * Open WhatsApp with the message prefilled in the input box.
 * Works on mobile (opens the WhatsApp app) and desktop (WhatsApp Web / app).
 */
export function openWhatsApp(phone: string, message: string) {
  const num = normalizePhone(phone)
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Open the phone dialer with the number filled in. */
export function openCall(phone: string) {
  const num = phone.replace(/[^\d+]/g, '')
  window.location.href = `tel:${num}`
}

/** React hook: current WhatsApp mode, updates live when changed anywhere. */
export function useWaMode(): [WaMode, (m: WaMode) => void] {
  const [mode, setMode] = useState<WaMode>(getWaMode())
  useEffect(() => {
    const onChange = (e: Event) => setMode((e as CustomEvent).detail as WaMode)
    window.addEventListener('lustre-wa-mode', onChange)
    return () => window.removeEventListener('lustre-wa-mode', onChange)
  }, [])
  return [mode, setWaMode]
}
