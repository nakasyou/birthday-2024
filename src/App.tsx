import {
  For,
  Show,
  createEffect,
  createSignal,
} from 'solid-js'
import './App.css'
import { age, msg, name } from './store'
import { Ballon } from './Ballon'
import confetti from 'canvas-confetti'

const shuffle = <T,>(data: T[]): T[] => {
  const copyed: T[] = [...data]
  const result: T[] = []
  for (let i = 0, len = copyed.length; i !== len; i++) {
    const index = Math.floor(copyed.length * Math.random())
    result.push(copyed.splice(index, 1)[0])
  }
  return result
}
function App() {
  const [getStartCount, setStartCount] = createSignal(3)

  const [getStartedTime, setStartedTime] = createSignal(0)

  const startUpdate = () =>
    setTimeout(() => {
      setStartCount((prev) => prev - 1)
      if (getStartCount() > 0) {
        startUpdate()
      }
    }, 1000)
  startUpdate()

  let timeInterval = 0
  const start = () => {
    const started = new Date().getTime()
    timeInterval = setInterval(() => {
      setStartedTime(new Date().getTime() - started)
    }, 20)
  }

  const [getBallons, setBallons] = createSignal(
    new Array(100).fill(null).map(() => ({
      color: `#${Math.floor(Math.random() * 0xffffff).toString(16)}`,
      destoryed: false,
    })),
  )
  const [getDestoryed, setDestoryed] = createSignal(0)
  const [getFinished, setFinished] = createSignal(false)
  createEffect(() => {
    if (getStartCount() === 0) {
      start()
    }
  })
  createEffect(() => {
    if (getDestoryed() === age) {
      clearInterval(timeInterval)
      setFinished(true)
      confetti({
        particleCount: 100,
        spread: 75,
      })
    }
  })
  const pointerConfetti =
    (particles: number) => (evt: MouseEvent | PointerEvent) => {
      confetti({
        origin: {
          x: evt.clientX / window.innerWidth,
          y: evt.clientY / window.innerHeight,
        },
        particleCount: particles,
        colors: shuffle([
          '#26ccff',
          '#a25afd',
          '#ff5e7e',
          '#88ff5a',
          '#fcff42',
          '#ffa62d',
          '#ff36ff',
        ]),
      })
    }
  return (
    <>
      <Show when={getStartCount() !== 0}>
        <div class="text-center grid grid-rows-2 place-items-center h-[100dvh]">
          <div class="text-2xl">{age}個の風船🎈をタップしよう！</div>
          <div class="text-5xl">{getStartCount()}</div>
        </div>
      </Show>
      <Show when={getStartCount() === 0 && !getFinished()}>
        <div class="w-full h-[100dvh]">
          <div class="font-mono fixed flex w-full justify-between">
            <div>
              {Math.floor(getStartedTime() / 1000)}.
              {(getStartedTime() % 1000).toString().padEnd(3, '0')}s
            </div>
            <div>
              {getDestoryed()} / {age}
            </div>
          </div>
          <div>
            <div class="grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 place-items-center">
              <For each={getBallons()}>
                {(ballon, i) => {
                  return (
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          confetti({
                            origin: {
                              x: e.clientX / window.innerWidth,
                              y: e.clientY / window.innerHeight,
                            },
                            particleCount: 3,
                          })
                          setBallons((prev) => {
                            prev[i()] = {
                              ...prev[i()],
                              destoryed: true,
                            }
                            return [...prev]
                          })
                          setDestoryed((p) => p + 1)
                        }}
                        hidden={ballon.destoryed}
                      >
                        <Ballon color={ballon.color} />
                      </button>
                    </div>
                  )
                }}
              </For>
            </div>
          </div>
        </div>
      </Show>
      <Show when={getFinished()}>
        <div
          onPointerMove={pointerConfetti(3)}
          class="w-full h-[100dvh] grid grid-rows-3 place-items-center touch-none"
        >
          <div class="text-xl text-center">
            Result: {getStartedTime() / 1000}s
          </div>
          <div class="text-3xl text-center">
            <div>Happy Birthday,</div>
            <div class="text-4xl font-bold">{name}!!</div>
          </div>
          <div class="text-center text-xl">{msg}</div>
        </div>
      </Show>
    </>
  )
}

export default App
