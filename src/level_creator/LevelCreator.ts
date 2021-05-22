import { BlockElement } from './BlockElement'
import { RowElement } from './RowElement'

export default class LevelCreator {
  private container: HTMLElement
  private blockFieldArray: number[][]
  private readonly height: number = 28
  private readonly width: number = 14
  constructor(container: HTMLElement) {
    window.customElements.define('row-element', RowElement)
    window.customElements.define('block-element', BlockElement)
    this.container = container
    this.blockFieldArray = this.initArray()
    this.render()
  }

  initArray(): number[][] {
    return [...new Array(this.height)].map(() => [...new Array(this.width)].map(() => 0))
  }

  render(): void {
    this.container.innerText = ''
    this.blockFieldArray.forEach((rowArr: number[]) => {
      const row = document.createElement('row-element') as RowElement
      rowArr.forEach((element: number) => {
        const elem = document.createElement('block-element')
        elem.dataset.selected = 'false'
        elem.setAttribute('selectable', String(true))
        row.appendChild(elem)
      })
      this.container.appendChild(row)
    })
  }
}
