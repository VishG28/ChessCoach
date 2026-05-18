import type { PieceSymbol } from 'chess.js'
import type {
  AvailableCapture,
  ThreatenedPiece,
} from '@/coaching/threats'
import type { BlunderAlert } from '@/coaching/useCoach'
import type { UseExplainResult } from '@/coaching/useExplain'
import type { LiveCoachMessage } from '@/coaching/useDeepCoach'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { ExplainBox } from './ExplainBox'
import { CoachMessage } from './CoachMessage'
import { TellMoreButton } from './TellMoreButton'

export interface CoachPanelProps {
  mode: 'off' | 'warnings' | 'full'
  threats: ThreatenedPiece[]
  captures: AvailableCapture[]
  blunderAlert: BlunderAlert | null
  thinking: boolean
  /** Engine is computing or waiting for its human-feel think delay. */
  engineThinking?: boolean
  onDismissAlert: () => void
  onTakeBackBlunder: () => void
  /** LLM/rule explanation result to show in the blunder card. Only used when mode === 'full'. */
  explain?: UseExplainResult
  /** Deep coach messages to render above legacy sections. */
  messages?: LiveCoachMessage[]
  /**
   * Legacy Tell-Me-More callback used when the parent owns a custom follow-up
   * prompt (e.g., PlayPage's `followUp` flow). When `requestDeepDive` is also
   * provided, `requestDeepDive` wins.
   */
  onTellMore?: (id: string) => void
  /**
   * Preferred Tell-Me-More handler from `useDeepCoach`. When supplied, the
   * panel renders a `TellMoreButton` under each completed brief message and
   * invokes this callback with the source message's id.
   */
  requestDeepDive?: (id: string) => void
  onQuieter?: () => void
}

const PIECE_GLYPH: Record<PieceSymbol, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
}

const PIECE_NAME: Record<PieceSymbol, string> = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
}

const SECTION_LABEL =
  'text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground'

const MODE_LABEL: Record<CoachPanelProps['mode'], string> = {
  off: 'Off',
  warnings: 'Warnings',
  full: 'Full',
}

export function CoachPanel({
  mode,
  threats,
  captures,
  blunderAlert,
  thinking,
  engineThinking,
  onDismissAlert,
  onTakeBackBlunder,
  explain,
  messages,
  onTellMore,
  requestDeepDive,
  onQuieter,
}: CoachPanelProps) {
  const isOff = mode === 'off'
  const hasMessages = messages && messages.length > 0

  // Prefer the new deep-dive handler; fall back to the legacy followUp callback.
  const tellMoreHandler = requestDeepDive ?? onTellMore
  // Quieter wiring is currently unused at the panel level (lives in PlayPage's
  // mode toggle). Keep the prop accepted for back-compat but reference it so
  // the type-checker treats it as intentionally consumed.
  void onQuieter

  return (
    <Card className="w-[560px]">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base tracking-tight">Coach</CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider',
                isOff
                  ? 'border-border bg-muted text-muted-foreground'
                  : 'border-foreground bg-foreground text-background',
              )}
            >
              {MODE_LABEL[mode]}
            </span>
            {thinking ? (
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-muted-foreground">
                <span
                  className="inline-block size-2 animate-pulse rounded-full bg-muted-foreground"
                  aria-hidden="true"
                />
                thinking…
              </span>
            ) : null}
            {engineThinking ? (
              <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium text-emerald-700">
                <span
                  className="inline-block size-2 animate-pulse rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                Engine thinking…
              </span>
            ) : null}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Deep coach messages rendered above legacy sections */}
        {hasMessages && (
          <div className="space-y-3">
            {messages!.map((msg) => {
              const isBrief = msg.trigger !== 'tell_me_more'
              const showTellMore = isBrief && !msg.streaming && !!tellMoreHandler
              return (
                <div key={msg.id} className="space-y-1">
                  <CoachMessage message={msg} />
                  {showTellMore && (
                    <TellMoreButton onClick={() => tellMoreHandler?.(msg.id)} />
                  )}
                </div>
              )
            })}
            <Separator />
          </div>
        )}

        {isOff ? (
          <p className="text-sm text-muted-foreground">
            Coaching is off.{' '}
            <span className="text-muted-foreground/70">
              Enable Warnings or Full in the left panel to see threats and
              blunder alerts.
            </span>
          </p>
        ) : (
          <>
            <BeforeMoveSection
              threats={threats}
              captures={captures}
              mode={mode}
            />
            <Separator />
            <AfterMoveSection
              alert={blunderAlert}
              mode={mode}
              onDismiss={onDismissAlert}
              onTakeBack={onTakeBackBlunder}
              explain={explain}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface BeforeMoveSectionProps {
  threats: ThreatenedPiece[]
  captures: AvailableCapture[]
  mode: 'warnings' | 'full'
}

function BeforeMoveSection({
  threats,
  captures,
  mode,
}: BeforeMoveSectionProps) {
  const empty = threats.length === 0 && captures.length === 0

  return (
    <section className="space-y-2">
      <span className={SECTION_LABEL}>Before your move</span>
      {empty ? (
        <p className="text-sm text-muted-foreground">
          No immediate threats or captures.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <ThreatsList threats={threats} />
          {mode === 'full' ? (
            <CapturesList captures={captures} />
          ) : (
            <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
              Switch Coach to Full to see capture suggestions.
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function ThreatsList({ threats }: { threats: ThreatenedPiece[] }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50/40 p-3 border-l-4 border-l-amber-400">
      <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-red-700">
        Threats
      </div>
      {threats.length === 0 ? (
        <p className="text-xs text-muted-foreground">None.</p>
      ) : (
        <ul className="space-y-1.5">
          {threats.map((t) => (
            <li
              key={`${t.square}-${t.piece}`}
              className="flex items-center gap-2 text-sm text-red-800"
            >
              <span className="text-base leading-none" aria-hidden="true">
                {PIECE_GLYPH[t.piece]}
              </span>
              <span>
                Your {PIECE_NAME[t.piece]} on{' '}
                <span className="font-mono">{t.square}</span>
                {t.attackedBy.length > 0 ? (
                  <>
                    {' '}is attacked from{' '}
                    {t.attackedBy.map((sq, i) => (
                      <span key={sq}>
                        {i > 0 ? ', ' : ''}
                        <span className="font-mono">{sq}</span>
                      </span>
                    ))}
                  </>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CapturesList({ captures }: { captures: AvailableCapture[] }) {
  return (
    <div className="rounded-md border border-emerald-200 bg-emerald-50/40 p-3 border-l-4 border-l-emerald-500">
      <div className="mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-700">
        Captures
      </div>
      {captures.length === 0 ? (
        <p className="text-xs text-muted-foreground">None available.</p>
      ) : (
        <ul className="space-y-1.5">
          {captures.map((c) => (
            <li
              key={`${c.from}-${c.to}`}
              className="flex items-center gap-2 text-sm text-emerald-800"
            >
              <span className="text-base leading-none" aria-hidden="true">
                {PIECE_GLYPH[c.captured]}
              </span>
              <span>
                Take {PIECE_NAME[c.captured]} on{' '}
                <span className="font-mono">{c.to}</span>{' '}
                <span className="text-emerald-600/80">
                  (from <span className="font-mono">{c.from}</span>)
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface AfterMoveSectionProps {
  alert: BlunderAlert | null
  mode: 'warnings' | 'full'
  onDismiss: () => void
  onTakeBack: () => void
  explain?: UseExplainResult
}

function AfterMoveSection({
  alert,
  mode,
  onDismiss,
  onTakeBack,
  explain,
}: AfterMoveSectionProps) {
  if (alert == null) {
    if (mode === 'full') {
      return (
        <section className="space-y-2">
          <span className={SECTION_LABEL}>After your move</span>
          <p className="text-sm text-muted-foreground">OK so far.</p>
        </section>
      )
    }
    return null
  }

  const lossPawns = (alert.loss / 100).toFixed(2)

  return (
    <section className="space-y-2">
      <span className={SECTION_LABEL}>After your move</span>
      <div className="rounded-lg border border-red-300 bg-amber-50 p-4 shadow-sm border-l-4 border-l-red-500">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="rounded bg-amber-200/70 px-1.5 py-0.5 font-mono text-sm font-semibold text-amber-900">
              {alert.san}
            </span>
            <span className="font-mono text-sm font-semibold text-amber-900 tabular-nums">
              −{lossPawns}
            </span>
          </div>
          <p className="text-sm text-amber-900/90">
            Engine prefers{' '}
            <span className="font-mono font-semibold">{alert.better}</span>.
          </p>
        </div>
        {mode === 'full' && explain && (
          <div className="mt-3">
            {explain.loading ? (
              <div className="animate-pulse space-y-2" aria-label="Loading explanation">
                <div className="h-3 w-3/4 rounded bg-amber-200/70" />
                <div className="h-3 w-full rounded bg-amber-200/70" />
                <div className="h-3 w-2/3 rounded bg-amber-200/70" />
              </div>
            ) : (
              <ExplainBox
                text={explain.text}
                source={explain.source}
                loading={explain.loading}
                error={explain.error}
                onRegenerate={explain.regenerate}
              />
            )}
          </div>
        )}
        <div className="mt-3 flex gap-2">
          <Button type="button" size="sm" onClick={onTakeBack}>
            Take it back
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="text-amber-900 hover:bg-amber-100"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </section>
  )
}
