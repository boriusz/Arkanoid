import { BlockElement } from './LevelCreator'

export class AreaSelector {
  private selector: HTMLElement
  private startX: number | undefined
  private startY: number | undefined
  private endX: number | undefined
  private endY: number | undefined
  private selectables: NodeListOf<BlockElement>
  constructor(selector: HTMLElement) {
    this.selector = selector
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e))
    document.addEventListener('mouseup', () => this.handleMouseup())
    this.selectables = document.querySelectorAll('block-element')
  }

  private renderArea(): void {
    const smallerX = Math.min(this.startX!, this.endX!)
    const biggerX = Math.max(this.startX!, this.endX!)
    const smallerY = Math.min(this.startY!, this.endY!)
    const biggerY = Math.max(this.startY!, this.endY!)

    this.selector.style.left = smallerX + 'px'
    this.selector.style.top = smallerY + 'px'

    this.selector.style.width = biggerX - smallerX + 'px'
    this.selector.style.height = biggerY - smallerY + 'px'
    Array.from(this.selectables).forEach((i) => (i.style.background = 'none'))

    const selected = Array.from(this.selectables).filter((el) => {
      const { x, y, width, height } = el.getBoundingClientRect()
      const topLeftCorner = { x, y }
      const topRightCorner = { x: x + width, y }
      const bottomLeftCorner = { x, y: y + height }
      const bottomRightCorner = { x: x + width, y: y + height }
      const corners = [topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner]
      return (
        corners.some(
          (corner) =>
            corner.x >= smallerX &&
            corner.x <= biggerX &&
            corner.y >= smallerY &&
            corner.y <= biggerY
        ) ||
        (x >= smallerX && x <= biggerX && smallerY >= y && biggerY <= y + height) ||
        (y >= smallerY && y <= biggerY && smallerX >= x && biggerX <= x + width) ||
        (smallerX >= x && smallerX <= x + width && smallerY >= y && smallerY <= y + height)
      )
    })
    selected.forEach((e) => (e.style.background = 'red'))
  }

  private handleMouseDown(e: MouseEvent): void {
    this.startX = e.clientX
    this.startY = e.clientY
    this.selector.style.top = 0 + 'px'
    this.selector.style.left = 0 + 'px'
    this.selector.style.width = 0 + 'px'
    this.selector.style.height = 0 + 'px'
    this.selector.hidden = false
    document.onmousemove = (e) => this.handleMouseMove(e)
    // document.addEventListener('mousemove', this.handleMouseMove.bind(this))
  }

  private handleMouseMove(e: MouseEvent): void {
    this.endX = e.clientX
    this.endY = e.clientY
    this.renderArea()
  }

  private handleMouseup(): void {
    this.selector.hidden = true
    this.startX = 0
    this.startY = 0
    this.endX = 0
    this.endY = 0
    document.onmousemove = null
    // document.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    // const selected = window.getSelection()?.anchorNode as unknown
    // if (selected instanceof BlockElement) {
    //   selected?.test()
    // }
  }
}
