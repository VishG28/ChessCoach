import { useEffect } from 'react'

interface ShortcutOptions {
  /** Set true to fire even when an input is focused. Default false. */
  allowInInput?: boolean
}

/**
 * `combo` is a lowercase string like 'mod+n', 'mod+z', 'arrowleft', '?', 'f', 'escape'.
 * 'mod' maps to Cmd on macOS and Ctrl elsewhere.
 */
export function useShortcut(combo: string, handler: () => void, opts: ShortcutOptions = {}): void {
  useEffect(() => {
    const isMac = navigator.platform.toLowerCase().includes('mac')
    const tokens = combo.toLowerCase().split('+')
    const wantMod = tokens.includes('mod')
    const wantShift = tokens.includes('shift')
    const wantAlt = tokens.includes('alt')
    const key = tokens.filter((t) => t !== 'mod' && t !== 'shift' && t !== 'alt').join('+')

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (!opts.allowInInput && target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
      const mod = isMac ? e.metaKey : e.ctrlKey
      if (wantMod && !mod) return
      if (!wantMod && (e.metaKey || e.ctrlKey)) return
      // Shift is only enforced when the combo requests it. Printable keys that
      // require Shift to produce (e.g. "?", "!") arrive as the shifted glyph
      // in e.key, so the key comparison below already encodes that state.
      if (wantShift && !e.shiftKey) return
      if (wantAlt !== e.altKey) return
      if (e.key.toLowerCase() !== key) return
      e.preventDefault()
      handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [combo, handler, opts.allowInInput])
}
