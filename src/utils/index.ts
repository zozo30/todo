export function buildTreeFromFlat(rows: Array<any>): Array<any> {
    const result: Array<any> = []

    const obj = rows.reduce((a, t) => ({ ...a, [t.id]: { ...t, childrens: [] } }), {})

    Object.values(obj)
        .forEach((v: any) => v.parentId !== null ? obj[v.parentId].childrens.push(v) : result.push(v))

    return result
}

export function buildTreeRecursive(rows: Array<any>, parent: null | number = null): Array<any> {
    const node: Array<any> = []

    rows.filter(n => n.parentId === parent)
        .forEach(n => node.push({ ...n, childrens: buildTreeRecursive(rows, n.id) }))

    return node
}