import { BlockElement } from './BlockElement'
import { FileManager } from './FileManager'
import LevelCreator from './LevelCreator'

export interface ResultInterface {
  x: number
  y: number
  sx: number
  sy: number
  sw: number
  sh: number
  dx: number
  dy: number
  dw: number
  dh: number
}

export class Controls {
  private readonly contextMenu: HTMLElement
  pressedKeys: {
    Delete: boolean
    s: boolean
    l: boolean
    z: boolean
    y: boolean
  }
  private fileManager: FileManager
  private creator: LevelCreator
  constructor(creator: LevelCreator) {
    this.creator = creator
    this.contextMenu = document.querySelector('#context-menu')!
    this.fileManager = new FileManager()
    this.pressedKeys = {
      Delete: false,
      s: false,
      l: false,
      z: false,
      y: false,
    }
  }

  boundElementClick(e: MouseEvent): [ResultInterface[], Array<{ x: number; y: number }>] {
    const blockElements = document.querySelectorAll('block-element')! as NodeListOf<BlockElement>
    const { sx, sy, sw, sh, dx, dy, dw, dh } = JSON.parse(
      (e.target as HTMLElement).getAttribute('parameters') as string
    )
    const selected = Array.from(blockElements).filter((f) => f.dataset.selected == 'true')
    const result: ResultInterface[] = []
    const toDelete: Array<{ x: number; y: number }> = []
    selected.forEach((s) => {
      const { x, y } = this.getCords(s)
      toDelete.push({ x, y })
      result.push({
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
    return [result, toDelete]
  }

  handleKeyDown(e: KeyboardEvent): Array<Array<{ x: number; y: number }>> {
    const result = []
    if (e.key === 'Delete' && !this.pressedKeys.Delete) {
      result.push(...this.handleDelete())
      return result
    } else {
      result.push([])
    }

    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (!this.pressedKeys.s) {
        this.pressedKeys.s = true
        this.handleSave()
      }
      return result
    }

    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if (!this.pressedKeys.l) {
        this.pressedKeys.l = true
        this.handleRead().then()
      }
      return result
    }

    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      this.handleUndo()
      return result
    }

    if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
      this.handleRedo()
      return result
    }

    return result
  }

  handleKeyUp(e: KeyboardEvent): void {
    const { key } = e
    if (key === 'Delete' || key === 's' || key === 'l' || key === 'z' || key === 'y')
      this.pressedKeys[key] = false
  }

  handleUndo(): void {
    this.creator.undo()
  }

  handleRedo(): void {
    this.creator.redo()
  }

  handleDelete(): Array<{ x: number; y: number }>[] {
    this.pressedKeys.Delete = true
    const blockElements = document.querySelectorAll('block-element') as NodeListOf<BlockElement>
    const toRemove: Array<{ x: number; y: number }> = []
    if (blockElements) {
      const selected = Array.from(blockElements).filter((f) => f.dataset.selected == 'true')
      selected.forEach((s) => {
        const { x, y } = this.getCords(s)
        toRemove.push({ x, y })
      })
    }
    return [toRemove]
  }

  handleSave(): void {
    this.fileManager.saveToFile(this.creator.getData())
  }

  async handleRead(): Promise<void> {
    const data = await this.fileManager.readFromFile()
    this.creator.setData(data)
  }

  handleContextMenu(e: MouseEvent): void {
    e.preventDefault()

    const { clientX: mouseX, clientY: mouseY } = e
    const { normalizedX, normalizedY } = this.normalizeContextMenuPosition(mouseX, mouseY)
    //
    this.contextMenu.style.top = `${normalizedY}px`
    this.contextMenu.style.left = `${normalizedX}px`

    this.contextMenu.classList.add('visible')
  }
  handleContextMenuHide(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (target.offsetParent !== this.contextMenu) {
      this.contextMenu.classList.remove('visible')
    }
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

  getCords(element: BlockElement): { x: number; y: number } {
    const x = Array.from(element!.parentElement!.children).findIndex((el) => el === element)
    const y = Array.from(element!.parentElement!.parentElement!.children).findIndex(
      (el) => el === element.parentElement
    )
    return { x, y }
  }
}
