export class BlockElement extends HTMLElement {
  constructor() {
    super()
  }

  select(): void {
    const currentState = this.dataset.selected === 'true'
    if (!currentState) {
      this.style.background = 'rgba(192, 192, 192, 0.6)'
    } else {
      this.style.background = 'none'
    }
  }

  saveState(): void {
    this.dataset.selected = String(this.style.background === 'rgba(192, 192, 192, 0.6)')
  }
}
