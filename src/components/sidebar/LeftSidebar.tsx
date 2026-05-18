import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import type { CoachingStyle } from '@/coaching/deepCoach'
import { BoardThemeCard } from '@/components/sidebar/BoardThemeCard'
import { PieceSetCard } from '@/components/sidebar/PieceSetCard'
import { useBoardTheme } from '@/components/board/BoardThemeProvider'
import { usePieceSet } from '@/components/board/PieceSetProvider'
import {
  resolveEngine,
  skillDescription,
  ELO_MIN,
  ELO_MAX,
  ELO_TICKS,
} from '@/engine/engineRouting'
import { RatingHelpModal } from '@/components/onboarding/RatingHelpModal'

function ResetAppearanceButton() {
  const { setThemeId } = useBoardTheme()
  const { setSetId } = usePieceSet()
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full text-xs"
      onClick={() => {
        setThemeId('classic')
        setSetId('standard')
      }}
    >
      Reset Board Appearance
    </Button>
  )
}

export type UserColor = 'white' | 'black' | 'random'
export type CoachMode = 'off' | 'warnings' | 'full'

export interface LeftSidebarProps {
  elo: number
  onEloChange: (elo: number) => void
  color: UserColor
  onColorChange: (color: UserColor) => void
  coachMode: CoachMode
  onCoachModeChange: (mode: CoachMode) => void
  onNewGame: () => void
  onTakeBack: () => void
  canTakeBack: boolean
  engineStatus: 'loading' | 'ready'
  coachingStyle?: CoachingStyle
  onCoachingStyleChange?: (s: CoachingStyle) => void
  allowPremoves?: boolean
  onAllowPremovesChange?: (v: boolean) => void
  arrowsMaster?: boolean
  onArrowsMasterChange?: (v: boolean) => void
  arrowsBest?: boolean
  onArrowsBestChange?: (v: boolean) => void
  arrowsThreats?: boolean
  onArrowsThreatsChange?: (v: boolean) => void
}

const COACH_MODES: ReadonlyArray<{ value: CoachMode; label: string }> = [
  { value: 'off', label: 'Off' },
  { value: 'warnings', label: 'Warnings' },
  { value: 'full', label: 'Full' },
]

const COLOR_OPTIONS: ReadonlyArray<{ value: UserColor; label: string }> = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'random', label: 'Random' },
]

const SECTION_LABEL =
  'text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground'

export function LeftSidebar({
  elo,
  onEloChange,
  color,
  onColorChange,
  coachMode,
  onCoachModeChange,
  onNewGame,
  onTakeBack,
  canTakeBack,
  engineStatus,
  coachingStyle,
  onCoachingStyleChange,
  allowPremoves,
  onAllowPremovesChange,
  arrowsMaster,
  onArrowsMasterChange,
  arrowsBest,
  onArrowsBestChange,
  arrowsThreats,
  onArrowsThreatsChange,
}: LeftSidebarProps) {
  const ready = engineStatus === 'ready'
  const styleDisabled = coachMode !== 'full'
  const premovesDisabled = coachMode === 'full'
  const [ratingHelpOpen, setRatingHelpOpen] = useState(false)
  const resolved = resolveEngine(elo)
  const tickPercent = (e: number): number =>
    ((e - ELO_MIN) / (ELO_MAX - ELO_MIN)) * 100

  return (
    <>
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base tracking-tight">Play</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="engine-elo" className={SECTION_LABEL}>
              Engine Elo
            </Label>
            <span className="font-mono text-sm tabular-nums text-foreground">
              {elo}
            </span>
          </div>
          <div className="relative">
            <Slider
              id="engine-elo"
              min={ELO_MIN}
              max={ELO_MAX}
              step={50}
              value={[elo]}
              onValueChange={(values) => {
                const next = values[0]
                if (typeof next === 'number') onEloChange(next)
              }}
            />
            <div className="pointer-events-none relative mt-1 h-2">
              {ELO_TICKS.map((t) => (
                <span
                  key={t}
                  className="absolute top-0 h-1.5 w-px -translate-x-1/2 bg-muted-foreground/40"
                  style={{ left: `${tickPercent(t)}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="relative mt-1 h-4 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground">
              {ELO_TICKS.map((t) => (
                <span
                  key={t}
                  className="absolute -translate-x-1/2 tabular-nums"
                  style={{ left: `${tickPercent(t)}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="secondary" className="font-mono">
              {resolved.modelLabel}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {skillDescription(elo)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRatingHelpOpen(true)}
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            What&rsquo;s my rating?
          </button>
          <RatingHelpModal open={ratingHelpOpen} onOpenChange={setRatingHelpOpen} />
        </section>

        <section className="space-y-3">
          <span className={SECTION_LABEL}>Play as</span>
          <RadioGroup
            value={color}
            onValueChange={(value) => onColorChange(value as UserColor)}
            className="grid grid-cols-3 gap-2"
          >
            {COLOR_OPTIONS.map((opt) => (
              <Label
                key={opt.value}
                htmlFor={`color-${opt.value}`}
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-card px-2 py-2 text-xs font-medium text-foreground transition-colors',
                  'hover:border-border hover:bg-muted',
                  color === opt.value &&
                    'border-primary bg-primary text-primary-foreground hover:bg-primary',
                )}
              >
                <RadioGroupItem
                  id={`color-${opt.value}`}
                  value={opt.value}
                  className="sr-only"
                />
                {opt.label}
              </Label>
            ))}
          </RadioGroup>
        </section>

        <section className="space-y-3">
          <span className={SECTION_LABEL}>Coach</span>
          <div className="inline-flex w-full rounded-md bg-muted p-1">
            {COACH_MODES.map((m) => (
              <Button
                key={m.value}
                type="button"
                size="sm"
                variant={coachMode === m.value ? 'default' : 'ghost'}
                onClick={() => onCoachModeChange(m.value)}
                className={cn(
                  'flex-1 rounded-[6px] text-xs font-medium',
                  coachMode === m.value
                    ? 'shadow-sm'
                    : 'text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </section>

        {onCoachingStyleChange && (
          <section className={cn('space-y-3', styleDisabled && 'pointer-events-none opacity-40')}>
            <span className={SECTION_LABEL}>Coaching style</span>
            <RadioGroup
              value={coachingStyle ?? 'conversational'}
              onValueChange={(v) => onCoachingStyleChange(v as CoachingStyle)}
              className="space-y-2"
            >
              {[
                { v: 'conversational', t: 'Conversational', d: 'Brief tactical and strategic tips, 1-3 bullets per move.' },
                { v: 'socratic',       t: 'Socratic',       d: 'Coach asks one question per move instead of giving answers.' },
                { v: 'tactical',       t: 'Tactical drills', d: 'One-line calculation prompts. Names pieces and squares, not moves.' },
              ].map((opt) => {
                const selected = (coachingStyle ?? 'conversational') === opt.v
                return (
                  <Label key={opt.v} htmlFor={`cs-${opt.v}`} className={cn(
                    'flex cursor-pointer flex-col gap-1 rounded-md border p-2.5 text-sm transition-colors',
                    selected
                      ? 'border-primary bg-accent text-foreground'
                      : 'border-border bg-card text-foreground hover:bg-accent/50',
                  )}>
                    <RadioGroupItem id={`cs-${opt.v}`} value={opt.v} className="sr-only" />
                    <span className={cn(
                      'text-sm font-semibold leading-tight',
                      selected ? 'text-primary' : 'text-foreground',
                    )}>{opt.t}</span>
                    <span className="text-xs leading-snug text-foreground/70">{opt.d}</span>
                  </Label>
                )
              })}
            </RadioGroup>
          </section>
        )}

        {onAllowPremovesChange !== undefined && (
          <section className="space-y-2">
            <span className={SECTION_LABEL}>Premoves</span>
            <div className="flex items-center gap-3">
              <Switch
                id="allow-premoves"
                checked={!!allowPremoves}
                onCheckedChange={onAllowPremovesChange}
                disabled={premovesDisabled}
                size="sm"
              />
              <Label
                htmlFor="allow-premoves"
                className={cn(
                  'cursor-pointer text-sm',
                  premovesDisabled && 'cursor-not-allowed opacity-50',
                )}
              >
                Allow premoves
              </Label>
            </div>
            {premovesDisabled ? (
              <p className="text-xs text-warning">
                Disabled while coach mode is &ldquo;full&rdquo; — pre-move coaching needs your full turn.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Click during opponent&rsquo;s turn to queue your next move.
              </p>
            )}
          </section>
        )}

        {onArrowsMasterChange !== undefined && (
          <section className="space-y-2">
            <span className={SECTION_LABEL}>Board Arrows</span>
            <div className="flex items-center gap-3">
              <Switch
                id="arrows-master"
                checked={!!arrowsMaster}
                onCheckedChange={onArrowsMasterChange}
                size="sm"
              />
              <Label htmlFor="arrows-master" className="cursor-pointer text-sm">
                Show arrows
              </Label>
            </div>
            <div className={cn('space-y-2 pl-1', !arrowsMaster && 'pointer-events-none opacity-40')}>
              {onArrowsBestChange !== undefined && (
                <div className="flex items-center gap-3">
                  <Switch
                    id="arrows-best"
                    checked={!!arrowsBest}
                    onCheckedChange={onArrowsBestChange}
                    disabled={!arrowsMaster}
                    size="sm"
                  />
                  <Label
                    htmlFor="arrows-best"
                    className={cn('cursor-pointer text-sm', !arrowsMaster && 'cursor-not-allowed')}
                  >
                    Best move suggestion
                  </Label>
                </div>
              )}
              {onArrowsThreatsChange !== undefined && (
                <div className="flex items-center gap-3">
                  <Switch
                    id="arrows-threats"
                    checked={!!arrowsThreats}
                    onCheckedChange={onArrowsThreatsChange}
                    disabled={!arrowsMaster}
                    size="sm"
                  />
                  <Label
                    htmlFor="arrows-threats"
                    className={cn('cursor-pointer text-sm', !arrowsMaster && 'cursor-not-allowed')}
                  >
                    Threat warnings
                  </Label>
                </div>
              )}
            </div>
          </section>
        )}

        <Separator />

        <section className="space-y-2">
          <Button
            type="button"
            onClick={onNewGame}
            className="w-full transition-transform duration-150 hover:scale-[1.02]"
            size="lg"
          >
            New Game
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onTakeBack}
            disabled={!canTakeBack}
            className="w-full"
            size="lg"
          >
            Take Back
          </Button>
        </section>

        <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              ready ? 'bg-emerald-500' : 'bg-amber-400',
            )}
            aria-hidden="true"
          >
            {!ready ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-amber-400 opacity-75" />
            ) : null}
          </span>
          <span className="font-medium tracking-wide">
            {ready ? 'Engine ready' : 'Engine loading…'}
          </span>
        </div>
      </CardContent>
    </Card>
    <BoardThemeCard />
    <PieceSetCard />
    <ResetAppearanceButton />
    </>
  )
}
