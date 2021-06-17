import * as image from '../assets/arkanoid.png'
import LevelCreator from './LevelCreator'

export class BlocksList {
  private readonly canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private parent: HTMLElement
  private readonly canvasWrapper: HTMLDivElement
  private img: HTMLImageElement | undefined
  private creator: LevelCreator
  constructor(parent: HTMLElement, creator: LevelCreator) {
    this.parent = parent
    this.creator = creator
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')!
    this.canvasWrapper = document.createElement('div')
    this.canvasWrapper.id = 'canvasWrapper'
    this.canvasWrapper.style.position = 'relative'
    this.parent.parentElement?.appendChild(this.canvasWrapper)
    this.canvasWrapper.appendChild(this.canvas)
    this.drawImage()
  }

  drawImage(): void {
    const img = new Image()
    img.onload = () => {
      this.img = img
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
          boundElement.addEventListener('click', (e) => {
            this.creator.handleElementPick(e)
          })

          this.canvasWrapper.appendChild(boundElement)
        }
      }
    }
    img.src = image.default
    this.canvas.width = 48 * 5
    this.canvas.height = 24 * 3
  }

  getImage() {
    return this.img
  }
}
