export interface DynamicVirtualListProps {
    width: string
    height: string
    itemEstimateSize: number
    itemCount: number
    listData: any[]
    buffer: number
}
export type ItemID = number
export interface ItemInfo {
    id: ItemID
    data: any
    top: number
    height: number
    bottom: number
}
export class LinkNode<T> {
    value: T
    pre: LinkNode<T>
    next: LinkNode<T>
    constructor(value?: T, pre?: LinkNode, next?: LinkNode) {
        this.value = value
        this.pre = pre ?? this // 默认指向自身形成闭环
        this.next = next ?? this
    }
}

export class DoublyLinkList<T> {
    vHead: LinkNode<T>
    length: number
    constructor() {
        this.vHead = new LinkNode()
        this.length = 0
        // this.vHead.next = linkList ?? this.vHead // 初始化虚拟头指向自身[1](@ref)
    }

    // 插入到虚拟头节点之后（链表头部）
    insertHead(linkNode: LinkNode) {
        if (this.length === 0) {
            this.vHead.pre = linkNode
            this.vHead.next = linkNode
            linkNode.next = this.vHead
            linkNode.pre = this.vHead
        } else {
            const second = this.vHead.next
            this.vHead.next = linkNode
            linkNode.next = second
            linkNode.pre = this.vHead
            second.pre = linkNode
        }
        this.length++
    }

    // 插入到链表尾部
    insertTail(linkNode: LinkNode) {
        if (this.length === 0) {
            this.vHead.pre = linkNode
            this.vHead.next = linkNode
            linkNode.next = this.vHead
            linkNode.pre = this.vHead
        } else {
            const lastSecond = this.vHead.pre
            this.vHead.pre = linkNode
            linkNode.pre = lastSecond
            lastSecond.next = linkNode
            linkNode.next = this.vHead
        }
        this.length++
    }

    // 按索引删除节点（索引从0开始）
    deleteByIndex(index: number) {
        if (index < 0 || this.vHead.next === this.vHead) return

        let current = this.vHead.next!
        let count = 0

        // 定位目标节点[7](@ref)
        while (count < index && current !== this.vHead) {
            current = current.next!
            count++
        }

        if (current === this.vHead || count !== index) return

        // 调整前后节点指针[8](@ref)
        const prevNode = current.pre
        const nextNode = current.next

        prevNode.next = nextNode
        nextNode.pre = prevNode

        // 清空被删节点引用（可选）
        current.pre = current
        current.next = current
        this.length--
    }
    getListLength() {
        return this.length
    }
    getLastNode() {
        return this.vHead.pre
    }
}

export function createLinkNode<T>(value?: T, pre?: LinkNode, next?: LinkNode) {
    return new LinkNode<T>(value, pre, next)
}

export function createDoublyLinkList<T>(linkList?: LinkNode) {
    return new DoublyLinkList<T>(linkList)
}
