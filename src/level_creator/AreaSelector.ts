import { BlockElement } from './BlockElement'

export class AreaSelector {
  private selector: HTMLElement
  private startX: number | undefined
  private startY: number | undefined
  private endX: number | undefined
  private endY: number | undefined
  private selectables: NodeListOf<BlockElement>
  private reverse = false
  constructor(selector: HTMLElement) {
    this.selector = selector
    // const main = document.querySelector('#main')!
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e as MouseEvent))
    document.addEventListener('mouseup', () => this.handleMouseup())
    this.selectables = document.querySelectorAll('block-element')
    this.selectables.forEach((s) => s.addEventListener('click', (e) => this.selectOne(e)))
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
    if (!this.reverse) {
      Array.from(this.selectables).forEach((i) => {
        i.dataset.selected = 'false'
        i.style.background = 'none'
      })
    }

    const selected = this.calculateSelectedBlocks(smallerX, smallerY, biggerX, biggerY)

    const previouslySelected = document.querySelectorAll<BlockElement>(`[data-selected='true']`)
    const notSelected = document.querySelectorAll<BlockElement>(`[data-selected='false']`)
    previouslySelected.forEach((s) => (s.style.background = 'rgba(192, 192, 192, 0.6)'))
    notSelected.forEach((s) => (s.style.background = 'none'))
    selected.forEach((e) => e.select())
  }

  private handleMouseDown(e: MouseEvent): void {
    this.reverse = e.ctrlKey || e.metaKey
    if (!(e.target instanceof BlockElement)) return
    this.startX = e.pageX
    this.startY = e.pageY
    this.selector.style.top = 0 + 'px'
    this.selector.style.left = 0 + 'px'
    this.selector.style.width = 0 + 'px'
    this.selector.style.height = 0 + 'px'
    this.selector.hidden = false
    document.onmousemove = (e) => this.handleMouseMove(e)
  }

  private handleMouseMove(e: MouseEvent): void {
    this.endX = e.pageX
    this.endY = e.pageY
    this.renderArea()
  }

  private handleMouseup(): void {
    this.selector.hidden = true
    this.startX = 0
    this.startY = 0
    this.endX = 0
    this.endY = 0
    document.onmousemove = null
    this.selectables.forEach((s) => s.saveState())
  }

  private selectOne(e: MouseEvent): void {
    const { target } = e
    if (target instanceof BlockElement) {
      if (!this.reverse) {
        Array.from(this.selectables).forEach((i) => {
          i.dataset.selected = 'false'
          i.style.background = 'none'
        })
        target.select()
        target.saveState()
      } else {
        target.select()
        target.saveState()
      }
    }
  }

  private calculateSelectedBlocks(
    smallerX: number,
    smallerY: number,
    biggerX: number,
    biggerY: number
  ) {
    return Array.from(this.selectables).filter((el) => {
      const { x, y, width, height } = el.getBoundingClientRect()
      const elapsedX = x + window.pageXOffset
      const elapsedY = y + window.pageYOffset
      const topLeftCorner = { x: elapsedX, y: elapsedY }
      const topRightCorner = { x: elapsedX + width, y: elapsedY }
      const bottomLeftCorner = { x: elapsedX, y: elapsedY + height }
      const bottomRightCorner = { x: elapsedX + width, y: elapsedY + height }
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
  }
}
