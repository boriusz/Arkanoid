export class RowElement extends HTMLElement {
  constructor(_optionalClasses?: string) {
    super()
  }

  removeChilds() {
    Array.from(this.children).forEach((child) => child.remove())
  }
}
