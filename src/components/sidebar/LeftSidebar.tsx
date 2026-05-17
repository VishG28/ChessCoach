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
import { cn } from '@/lib/utils'

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
  'text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-neutral-500'

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
}: LeftSidebarProps) {
  const ready = engineStatus === 'ready'

  return (
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
            <span className="font-mono text-sm tabular-nums text-neutral-800">
              {elo}
            </span>
          </div>
          <Slider
            id="engine-elo"
            min={300}
            max={2000}
            step={20}
            value={[elo]}
            onValueChange={(values) => {
              const next = values[0]
              if (typeof next === 'number') onEloChange(next)
            }}
          />
          <div className="flex justify-between text-[0.65rem] font-medium uppercase tracking-wider text-neutral-400">
            <span>Beginner</span>
            <span>Master</span>
          </div>
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
                  'flex cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-2 py-2 text-xs font-medium text-neutral-700 transition-colors',
                  'hover:border-neutral-300 hover:bg-neutral-50',
                  color === opt.value &&
                    'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-900',
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
          <div className="inline-flex w-full rounded-md bg-neutral-100 p-1">
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
                    : 'text-neutral-600 hover:bg-white hover:text-neutral-900',
                )}
              >
                {m.label}
              </Button>
            ))}
          </div>
        </section>

        <Separator />

        <section className="space-y-2">
          <Button
            type="button"
            onClick={onNewGame}
            className="w-full"
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

        <div className="flex items-center gap-2 pt-1 text-xs text-neutral-500">
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
  )
}
