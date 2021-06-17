import { ResultInterface } from './Controls'

export class FileManager {
  constructor() {}

  saveToFile(data: ResultInterface[]): boolean {
    if (data) {
      return true
    } else return false
  }

  readFromFile(): ResultInterface[] {
    return []
  }
}
