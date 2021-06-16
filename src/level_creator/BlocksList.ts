import * as image from '../assets/arkanoid.png'
import { BlockElement } from './BlockElement'

export class BlocksList {
  private readonly canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private parent: HTMLElement
  private canvasWrapper: HTMLDivElement
  private data: Record<string, number>[]
  private boardRepresentation: HTMLCanvasElement
  boardRepresentationContext: CanvasRenderingContext2D
  constructor(parent: HTMLElement) {
    this.parent = parent
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!
    this.boardRepresentation = document.querySelector('#board-representation')!
    this.boardRepresentationContext = this.boardRepresentation.getContext('2d')!
    this.canvasWrapper = document.createElement('div')
    this.canvasWrapper.id = 'canvasWrapper'
    this.canvasWrapper.style.position = 'relative'
    this.parent.parentElement?.appendChild(this.canvasWrapper)
    this.canvasWrapper.appendChild(this.canvas)
    this.data = []
    this.drawImage()
  }

  drawImage(): void {
    const img = new Image()
    img.onload = () => {
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 5; x++) {
          const boundElement = document.createElement('div')
          boundElement.style.width = '48px'
          boundElement.style.height = '24px'
          boundElement.style.position = 'absolute'
          boundElement.style.top = `${y * 24}px`
          boundElement.style.left = `${x * 48}px`
          boundElement.className = 'bound'
          boundElement.setAttribute('x', String(x))
          boundElement.setAttribute('y', String(y))
          this.context.drawImage(
            img,
            5 + (x * 8 + x * 2),
            216 + (y * 4 + y),
            8,
            4,
            x * 48,
            y * 24,
            48,
            24
          )
          boundElement.setAttribute(
            'parameters',
            JSON.stringify({
              sx: 5 + (x * 8 + x * 2),
              sy: 216 + (y * 4 + y),
              sw: 8,
              sh: 4,
              dx: 48,
              dy: 24,
              dw: 48,
              dh: 24,
            })
          )
          boundElement.onclick = (e) => {
            const blockElements = document.querySelectorAll(
              'block-element'
            ) as NodeListOf<BlockElement>
            const { sx, sy, sw, sh, dx, dy, dw, dh } = JSON.parse(
              (e.target as HTMLElement).getAttribute('parameters') as string
            )
            if (blockElements) {
              const selected = Array.from(blockElements).filter((f) => f.dataset.selected == 'true')
              selected.forEach((s) => {
                const y = Array.from(s!.parentElement!.parentElement!.children).findIndex(
                  (el) => el === s.parentElement
                )
                const x = Array.from(s!.parentElement!.children).findIndex((el) => el === s)
                const posExisting = this.data.findIndex((el) => el.x === x && el.y === y)
                if (posExisting >= 0) {
                  // console.log(posExisting)
                  this.data.splice(posExisting, 1)
                }
                this.data.push({
                  x,
                  y,
                  sx,
                  sy,
                  sw,
                  sh,
                  dx: x * dx,
                  dy: y * dy,
                  dw: dw + 1,
                  dh,
                })
              })
              console.log(this.data)
              this.boardRepresentationContext.clearRect(
                0,
                0,
                this.boardRepresentation.width,
                this.boardRepresentation.height
              )
              this.data.forEach((d) => {
                const { sx, sy, sw, sh, dx, dy, dw, dh } = d
                this.boardRepresentationContext.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
              })
            }
          }
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete') {
              const blockElements = document.querySelectorAll(
                'block-element'
              ) as NodeListOf<BlockElement>
              if (blockElements) {
                const selected = Array.from(blockElements).filter(
                  (f) => f.dataset.selected == 'true'
                )
                selected.forEach((s) => {
                  const y = Array.from(s!.parentElement!.parentElement!.children).findIndex(
                    (el) => el === s.parentElement
                  )
                  const x = Array.from(s!.parentElement!.children).findIndex((el) => el === s)
                  const posExisting = this.data.findIndex((el) => el.x === x && el.y === y)
                  if (posExisting >= 0) {
                    this.data.splice(posExisting, 1)
                  }
                })
                console.log(this.data)
                this.boardRepresentationContext.clearRect(
                  0,
                  0,
                  this.boardRepresentation.width,
                  this.boardRepresentation.height
                )
                this.data.forEach((d) => {
                  const { sx, sy, sw, sh, dx, dy, dw, dh } = d
                  this.boardRepresentationContext.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
                })
              }
            }
          })
          this.canvasWrapper.appendChild(boundElement)
        }
      }
    }
    img.src = image.default
    this.canvas.width = 48 * 5
    this.canvas.height = 24 * 3
  }
}
