interface Node {
  children: { [x: string]: Node },
  value: any | null,
}

export class Trie {
  _root: Node = this._createNode()

  _createNode(): Node {
    return {
      children: {}, // char -> node
      value: null
    }
  }

  set(key: string, value: any) {
    if (key === '') {
      throw new Error('key is empty')
    }
    let node = this._root
    // 将 emoticon 的 key 的每一个字符存成 children
    for (let char of key) {
      let nextNode = node.children[char]
      if (nextNode === undefined) {
        nextNode = node.children[char] = this._createNode()
      }
      node = nextNode
    }
    node.value = value
  }

  get(key: string): any {
    let node = this._root
    for (let char of key) {
      let nextNode = node.children[char]
      if (nextNode === undefined) {
        return null
      }
      node = nextNode
    }
    return node.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  // 用单个字符不断寻找下一个字符，感觉会将【2333, 和 33 认定为是一个表情】
  // 如果一个子串，中间的字符都存在于表情包设定中，显示的表情会由该子串最后一个【字符】决定
  greedyMatch(str: string): any {
    let node = this._root
    let node_values: { [n: number]: any } = {}
    let match_num = 0
    for (let char of str) {
      let nextNode = node.children[char]
      if (nextNode === undefined) {
        break
      }
      if (nextNode.value !== null) {
        node_values[match_num] = nextNode.value
        match_num++
      }
      node = nextNode
    }
    if (match_num === 0) {
      return null
    } else {
      return node_values[match_num - 1]
    }
  }

  lazyMatch(str: string): any {
    let node = this._root
    for (let char of str) {
      let nextNode = node.children[char]
      if (nextNode === undefined) {
        return null
      }
      if (nextNode.value !== null) {
        return nextNode.value
      }
      node = nextNode
    }
    return null
  }
}