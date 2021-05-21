import LevelCreator from './level_creator/LevelCreator'
import { AreaSelector } from './level_creator/AreaSelector'
require('../styles/main.css')

export default class Main {
  private levelCreator: LevelCreator
  private readonly mainContainer: HTMLElement
  private readonly fieldSelector: HTMLElement
  private areaSelector: AreaSelector
  constructor() {
    this.mainContainer = document.querySelector<HTMLElement>('#main')!
    this.fieldSelector = document.querySelector<HTMLElement>('#field-select')!
    this.levelCreator = new LevelCreator(this.mainContainer)
    this.areaSelector = new AreaSelector(this.fieldSelector)
  }
}

new Main()
