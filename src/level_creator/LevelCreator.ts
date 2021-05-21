class RowElement extends HTMLElement {
  constructor(_optionalClasses?: string | null) {
    super()
  }

  removeChilds() {
    Array.from(this.children).forEach((child) => child.remove())
  }
}

export class BlockElement extends HTMLElement {
  constructor() {
    super()
  }
  test() {
    const currentState = this.dataset.selected === 'true'
    this.dataset.selected = String(!currentState)
    if (!currentState) {
      this.style.background = 'red'
    } else {
      this.style.background = 'none'
    }
  }
}

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
