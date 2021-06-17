import { BlockElement } from './BlockElement'
import { RowElement } from './RowElement'
import { BlocksList } from './BlocksList'
import { Controls, ResultInterface } from './Controls'
import { ContextMenu } from './ContextMenu'

export default class LevelCreator {
  private readonly container: HTMLElement
  private blockFieldArray: number[][]
  private readonly height: number = 28
  private readonly width: number = 14
  private blocks: BlocksList
  private data: ResultInterface[]
  private states: ResultInterface[][]
  private currentState: number
  private controls: Controls
  private contextMenu: ContextMenu
  private boardRepresentation: HTMLCanvasElement
  boardRepresentationContext: CanvasRenderingContext2D
  constructor(container: HTMLElement) {
    window.customElements.define('row-element', RowElement)
    window.customElements.define('block-element', BlockElement)

    this.boardRepresentation = document.querySelector('#board-representation')!
    this.boardRepresentationContext = this.boardRepresentation.getContext('2d')!

    this.container = container
    this.blockFieldArray = this.initArray()

    this.data = []
    this.states = [[]]
    this.currentState = 0

    this.controls = new Controls(this)
    this.contextMenu = new ContextMenu(this.controls, this)

    this.blocks = new BlocksList(this.container, this)

    this.initListeners()
    this.render()
  }

  initListeners(): void {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete') {
        const [toDelete] = this.controls.handleKeyDown(e)
        toDelete.forEach(({ x, y }: { x: number; y: number }) => this.removeExisting(x, y))
        this.setData(this.getData()) // Set state after deletion
      } else {
        this.controls.handleKeyDown(e)
      }
      this.renderRepresentation()
    })

    document.addEventListener('keyup', (e) => {
      this.controls.handleKeyUp(e)
    })

    document.addEventListener('contextmenu', (e) => {
      this.controls.handleContextMenu(e)
    })

    document.addEventListener('click', (e) => {
      this.controls.handleContextMenuHide(e)
    })
  }

  initArray(): number[][] {
    return [...new Array(this.height)].map(() => [...new Array(this.width)].map(() => 0))
  }

  render(): void {
    this.container.innerText = ''
    this.blockFieldArray.forEach((rowArr: number[]) => {
      const row = document.createElement('row-element') as RowElement
      rowArr.forEach((_element: number) => {
        const elem = document.createElement('block-element')
        elem.dataset.selected = 'false'
        elem.setAttribute('selectable', String(true))
        row.appendChild(elem)
      })
      this.container.appendChild(row)
    })
  }

  addItemsToData(elements: ResultInterface[]): void {
    if (this.states.length > this.currentState + 1) {
      this.states.splice(this.currentState + 1)
    }
    console.log(this.states)
    this.data.push(...elements)
    this.states.push(JSON.parse(JSON.stringify(this.data)))
    console.log(this.states)
    this.currentState++
    this.renderRepresentation()
  }

  setData(elements: ResultInterface[]): void {
    if (this.states.length > this.currentState + 1) {
      this.states.splice(this.currentState + 1)
    }
    this.data = elements
    this.states.push(JSON.parse(JSON.stringify(this.data)))
    console.log(this.states)
    this.currentState++
    this.renderRepresentation()
  }

  getData(): ResultInterface[] {
    return this.data
  }

  undo(): void {
    if (this.currentState >= 0 && this.currentState - 1 >= 0) {
      this.currentState--
      this.data = JSON.parse(JSON.stringify(this.states[this.currentState]))
      this.renderRepresentation()
    }
  }
  redo(): void {
    if (this.currentState >= 0 && this.currentState + 1 < this.states.length) {
      this.currentState++
      this.data = JSON.parse(JSON.stringify(this.states[this.currentState]))
      console.log(this.states, this.currentState)
      this.renderRepresentation()
    }
  }

  handleElementPick(e: MouseEvent): void {
    const [result, toDelete] = this.controls.boundElementClick(e)
    toDelete.forEach(({ x, y }: { x: number; y: number }) => {
      this.removeExisting(x, y)
    })
    this.addItemsToData(result)
    this.renderRepresentation()
  }

  removeExisting(x: number, y: number): void {
    const posExisting = this.data.findIndex((el) => el.x === x && el.y === y)
    if (posExisting >= 0) {
      this.data.splice(posExisting, 1)
    }
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
      const img = this.blocks.getImage()
      this.boardRepresentationContext.drawImage(img!, sx, sy, sw, sh, dx, dy, dw, dh)
    })
  }
}
