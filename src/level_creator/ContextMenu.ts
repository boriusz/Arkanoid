import { Controls } from './Controls'
import LevelCreator from './LevelCreator'

export class ContextMenu {
  private menu: HTMLElement
  private delete: HTMLElement
  private undo: HTMLElement
  private redo: HTMLElement
  private saveToFile: HTMLElement
  private readFromFile: HTMLElement
  private controls: Controls
  private creator: LevelCreator
  constructor(controls: Controls, creator: LevelCreator) {
    this.menu = document.querySelector('#context-menu')!
    this.controls = controls
    this.creator = creator

    this.delete = document.querySelector('#delete')!
    this.delete.addEventListener('click', () => {
      const [toDelete] = this.controls.handleDelete()
      toDelete.forEach(({ x, y }) => {
        this.creator.removeExisting(x, y)
      })
      this.controls.pressedKeys.Delete = false
      this.creator.setData(this.creator.getData()) // Save state after deletion
      this.creator.renderRepresentation()
    })
    this.saveToFile = document.querySelector('#save')!
    this.saveToFile.addEventListener('click', () => {
      this.controls.handleSave()
    })

    this.readFromFile = document.querySelector('#read')!
    this.readFromFile.addEventListener('click', () => {
      this.controls.handleRead()
    })

    this.undo = document.querySelector('#undo')!
    this.undo.addEventListener('click', () => {
      this.controls.handleUndo()
    })
    this.redo = document.querySelector('#redo')!
    this.redo.addEventListener('click', () => {
      this.controls.handleRedo()
    })
  }
}
