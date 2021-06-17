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
  private img: HTMLImageElement | undefined
  private contextMenu: HTMLElement
  private pressedKeys: {
    delete: boolean
    s: boolean
    l: boolean
    z: boolean
    y: boolean
  }
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
    this.contextMenu = document.querySelector('#context-menu')!
    this.drawImage()
    this.pressedKeys = {
      delete: false,
      s: false,
      l: false,
      z: false,
      y: false,
    }
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
                const { x: xCord, y: yCord } = this.removeExisting(s)
                this.data.push({
                  x: xCord,
                  y: yCord,
                  sx,
                  sy,
                  sw,
                  sh,
                  dx: xCord * dx,
                  dy: yCord * dy,
                  dw: dw + 1,
                  dh,
                })
              })
              this.renderRepresentation()
            }
          }

          this.canvasWrapper.appendChild(boundElement)
        }
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Delete' && !this.pressedKeys.delete) {
            this.pressedKeys.delete = true
            const blockElements = document.querySelectorAll(
              'block-element'
            ) as NodeListOf<BlockElement>
            if (blockElements) {
              const selected = Array.from(blockElements).filter((f) => f.dataset.selected == 'true')
              selected.forEach((s) => {
                this.removeExisting(s)
              })
              this.renderRepresentation()
            }
            return
          }

          if (e.key === 's' && e.ctrlKey) {
            e.preventDefault()
            if (!this.pressedKeys.s) {
              this.pressedKeys.s = true
              console.log('saving to file')
              return
            }
          }

          if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault()
            if (!this.pressedKeys.l) {
              this.pressedKeys.l = true
              console.log('reading from file')
              return
            }
          }
        })

        document.addEventListener('keyup', (e) => {
          const { key } = e
          if (key === 'delete' || key === 's' || key === 'l' || key === 'z' || key === 'y')
            this.pressedKeys[key] = false
        })

        document.addEventListener('contextmenu', (e) => {
          e.preventDefault()

          const { clientX: mouseX, clientY: mouseY } = e
          const { normalizedX, normalizedY } = this.normalizeContextMenuPosition(mouseX, mouseY)
          //
          this.contextMenu.style.top = `${normalizedY}px`
          this.contextMenu.style.left = `${normalizedX}px`

          this.contextMenu.classList.add('visible')
        })

        document.addEventListener('click', (e) => {
          const target = e.target as HTMLElement
          if (target.offsetParent !== this.contextMenu) {
            this.contextMenu.classList.remove('visible')
          }
        })
      }
    }
    img.src = image.default
    this.canvas.width = 48 * 5
    this.canvas.height = 24 * 3
  }

  normalizeContextMenuPosition(
    mouseX: number,
    mouseY: number
  ): { normalizedX: number; normalizedY: number } {
    const { left: scopeOffsetX, top: scopeOffsetY } = document.body.getBoundingClientRect()

    const scopeX = mouseX - scopeOffsetX
    const scopeY = mouseY - scopeOffsetY

    const outOfBoundsOnX = scopeX + this.contextMenu.clientWidth > document.body.clientWidth
    const outOfBoundsOnY = scopeY + this.contextMenu.clientHeight > document.body.clientWidth

    let normalizedX = mouseX
    let normalizedY = mouseY

    if (outOfBoundsOnX) {
      normalizedX = scopeOffsetX + document.body.clientWidth - this.contextMenu.clientWidth
    }
    if (outOfBoundsOnY) {
      normalizedY = scopeOffsetY + document.body.clientHeight - this.contextMenu.clientHeight
    }

    return { normalizedX, normalizedY }
  }

  removeExisting(element: BlockElement): { x: number; y: number } {
    const y = Array.from(element!.parentElement!.parentElement!.children).findIndex(
      (el) => el === element.parentElement
    )
    const x = Array.from(element!.parentElement!.children).findIndex((el) => el === element)
    const posExisting = this.data.findIndex((el) => el.x === x && el.y === y)
    if (posExisting >= 0) {
      this.data.splice(posExisting, 1)
    }
    return { x, y }
  }

  renderRepresentation(): void {
    this.boardRepresentationContext.clearRect(
      0,
      0,
      this.boardRepresentation.width,
      this.boardRepresentation.height
    )
    this.data.forEach((d) => {
      const { sx, sy, sw, sh, dx, dy, dw, dh } = d
      this.boardRepresentationContext.drawImage(this.img!, sx, sy, sw, sh, dx, dy, dw, dh)
    })
  }
}
