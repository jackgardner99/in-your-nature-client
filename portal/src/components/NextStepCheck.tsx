import type { NextStep } from '../api/types'
import { monthDay } from '../lib/format'
import { useNextSteps } from '../state/nextSteps'
import './NextStepCheck.css'

export default function NextStepCheck({ step, showDue }: { step: NextStep; showDue?: boolean }) {
  const { setDone } = useNextSteps()
  return (
    <div className="check">
      <input
        id={`step-${step.id}`}
        type="checkbox"
        checked={step.done}
        onChange={(e) => setDone(step.id, e.target.checked)}
      />
      <label htmlFor={`step-${step.id}`}>
        {step.text}
        {showDue && step.dueDate && (
          <>
            <br />
            <span className="check-due">Due {monthDay(step.dueDate)}</span>
          </>
        )}
      </label>
    </div>
  )
}
