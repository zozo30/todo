import { infoToProjection } from '../src/utils/graphql'
import { buildTreeFromFlat, buildTreeRecursive } from '../src/utils/index'
import { FieldNode, SelectionSetNode } from 'graphql'

describe('utils', () => {
    describe('infoToProjection', () => {
        const resolverInfoObject = {
            kind: 'Field',
            name: {
                kind: 'Name',
                value: 'todos'
            },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'total' }
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'take' }
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'skip' }
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'items' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' }
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'description' }
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' }
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' }
                                },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'completed' }
                                }
                            ]
                        }
                    }
                ]
            } as SelectionSetNode
        } as FieldNode

        test('topLevelFieldSelect', () => {
            const result = infoToProjection(resolverInfoObject)
            expect(result).toEqual(['total', 'take', 'skip', 'items'])
        })

        test('subLevelFieldSelect', () => {
            const result = infoToProjection(resolverInfoObject, 'items')
            expect(result).toEqual(['id', 'description', 'createdAt', 'updatedAt', 'completed'])
        })

        test('shouldGiveEmptySelectionsByWrongArgument', () => {
            const result = infoToProjection(resolverInfoObject, 'wrong argument')
            expect(result).toEqual(undefined)
        })

        test('selectionFieldKind not Field', () => {
            const node = {
                kind: 'Field',
                name: {
                    kind: 'Name',
                    value: 'todos'
                },
                selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'total' }
                        },
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'take' }
                        },
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'skip' }
                        },
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'items' },
                            selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                    {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: 'id' }
                                    },
                                    {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: 'description' }
                                    },
                                    {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: 'createdAt' }
                                    },
                                    {
                                        kind: 'Field',
                                        name: { kind: 'Name', value: 'updatedAt' }
                                    },
                                    {
                                        kind: 'FragmentSpread',
                                        name: { kind: 'Name', value: 'completed' }
                                    }
                                ]
                            }
                        }
                    ]
                } as SelectionSetNode
            } as FieldNode

            const result = infoToProjection(node, 'items')
            expect(result).toEqual(['id', 'description', 'createdAt', 'updatedAt'])
        })

        test('with picSlection and selectionSet is undefined', () => {

            const node = {
                kind: 'Field',
                name: {
                    kind: 'Name',
                    value: 'todos'
                },
                selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'total' }
                        },
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'take' }
                        },
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'skip' }
                        },
                        {
                            kind: 'Field',
                            name: { kind: 'Name', value: 'items' },
                            selectionSet: undefined
                        }
                    ]
                } as SelectionSetNode
            } as FieldNode

            const result = infoToProjection(node, 'items')
            expect(result).toEqual(undefined)
        })

    })

    describe('buildTreeFromFlat', () => {
        const rows = [
            { id: 1, description: 'root', parentId: null },
            { id: 2, description: 'root.1', parentId: 1 },
            { id: 3, description: 'root.2', parentId: 1 },
            { id: 4, description: 'root.1.1', parentId: 2 },
            { id: 5, description: 'root.1.1.1', parentId: 4 },
            { id: 6, description: 'root.1.1.2', parentId: 4 },
            { id: 7, description: 'root2', parentId: null },
            { id: 8, description: 'root2.1', parentId: 7 },
        ]

        test('check', () => {
            const result = buildTreeFromFlat(rows)
            expect(result).toHaveLength(2)
            expect(result[0]).toHaveProperty('id', 1)
            expect(result[1]).toHaveProperty('id', 7)
            expect(result[0].childrens).toHaveLength(2)
            expect(result[1].childrens).toHaveLength(1)
            expect(result[1].childrens[0]).toHaveProperty('id', 8)
            expect(result[0].childrens[0]).toHaveProperty('id', 2)
            expect(result[0].childrens[1]).toHaveProperty('id', 3)
            expect(result[0].childrens[0].childrens).toHaveLength(1)
            expect(result[0].childrens[0].childrens[0]).toHaveProperty('id', 4)
            expect(result[0].childrens[0].childrens[0].childrens).toHaveLength(2)
            expect(result[0].childrens[0].childrens[0].childrens[0]).toHaveProperty('id', 5)
            expect(result[0].childrens[0].childrens[0].childrens[1]).toHaveProperty('id', 6)
        })
    })

    describe('buildTreeRecursive', () => {
        const rows = [
            { id: 1, description: 'root', parentId: null },
            { id: 2, description: 'root.1', parentId: 1 },
            { id: 3, description: 'root.2', parentId: 1 },
            { id: 4, description: 'root.1.1', parentId: 2 },
            { id: 5, description: 'root.1.1.1', parentId: 4 },
            { id: 6, description: 'root.1.1.2', parentId: 4 },
            { id: 7, description: 'root2', parentId: null },
            { id: 8, description: 'root2.1', parentId: 7 },
        ]

        const result = buildTreeRecursive(rows)
        expect(result).toHaveLength(2)
        expect(result[0]).toHaveProperty('id', 1)
        expect(result[1]).toHaveProperty('id', 7)
        expect(result[0].childrens).toHaveLength(2)
        expect(result[1].childrens).toHaveLength(1)
        expect(result[1].childrens[0]).toHaveProperty('id', 8)
        expect(result[0].childrens[0]).toHaveProperty('id', 2)
        expect(result[0].childrens[1]).toHaveProperty('id', 3)
        expect(result[0].childrens[0].childrens).toHaveLength(1)
        expect(result[0].childrens[0].childrens[0]).toHaveProperty('id', 4)
        expect(result[0].childrens[0].childrens[0].childrens).toHaveLength(2)
        expect(result[0].childrens[0].childrens[0].childrens[0]).toHaveProperty('id', 5)
        expect(result[0].childrens[0].childrens[0].childrens[1]).toHaveProperty('id', 6)
    })
})