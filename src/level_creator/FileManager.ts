import { ResultInterface } from './Controls'

export class FileManager {
  constructor() {}

  saveToFile(data: ResultInterface[]): boolean {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/json' })
    const link = document.createElement('a')

    link.download = `${new Date().getTime()}.json`
    link.href = window.URL.createObjectURL(blob)
    link.dataset.downloadurl = ['text/json', link.download, link.href].join(':')

    const evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })

    link.dispatchEvent(evt)
    link.remove()
    return true
  }

  readData(data: HTMLInputElement): Promise<ResultInterface[]> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(JSON.parse(reader.result))
        }
      }
      if (data.files) {
        if (data.files.length > 0) {
          reader.readAsText(data.files[0])
        }
      }
    })
  }

  async readFromFile(): Promise<ResultInterface[]> {
    return new Promise((resolve) => {
      const el = document.createElement('input')
      el.setAttribute('type', 'file')
      el.setAttribute('accept', 'application/JSON')
      el.onchange = async () => {
        const data = await this.readData(el)
        resolve(data)
      }
      el.click()
      el.remove()
    })
  }
}
