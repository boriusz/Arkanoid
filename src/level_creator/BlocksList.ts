import * as image from '../assets/arkanoid.png'

export class BlocksList {
  private readonly canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private parent: HTMLElement
  private canvasWrapper: HTMLDivElement
  constructor(parent: HTMLElement) {
    this.parent = parent
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
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 5; x++) {
          const boundElement = document.createElement('div')
          boundElement.style.width = '48px'
          boundElement.style.height = '24px'
          boundElement.style.position = 'absolute'
          boundElement.style.top = `${y * 24}px`
          boundElement.style.left = `${x * 48}px`
          boundElement.setAttribute('x', String(x))
          boundElement.setAttribute('y', String(y))
          this.canvasWrapper.appendChild(boundElement)
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
        }
      }
    }
    img.src = image.default
    this.canvas.width = 48 * 5
    this.canvas.height = 24 * 3
  }
}
