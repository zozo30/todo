import { FieldNode } from "graphql";

export function infoToProjection(node: FieldNode, pickSelection?: string): string[] {
    return node.selectionSet.selections.reduce((projection, selection) => {
        if (selection.kind !== 'Field') return [...projection]
        if (!pickSelection) return [...projection, selection.name.value]

        if (pickSelection === selection.name.value) {
            if (selection.selectionSet !== undefined) {
                return infoToProjection(selection)
            }
        }
    }, [])
}