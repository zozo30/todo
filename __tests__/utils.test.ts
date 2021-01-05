import { infoToProjection } from '../src/utils/graphql'
import { buildTreeFromFlat, buildTreeRecursive } from '../src/utils/index'
import { FieldNode, SelectionSetNode } from 'graphql'
import { expect } from 'chai'

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
        it('topLevelFieldSelect', () => {
            const result = infoToProjection(resolverInfoObject)
            expect(result).deep.equal(['total', 'take', 'skip', 'items'])
        })

        it('subLevelFieldSelect', () => {
            const result = infoToProjection(resolverInfoObject, 'items')
            expect(result).deep.equal(['id', 'description', 'createdAt', 'updatedAt', 'completed'])
        })

        it('shouldGiveEmptySelectionsByWrongArgument', () => {
            const result = infoToProjection(resolverInfoObject, 'wrong argument')
            expect(result).equal(undefined)
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

        it('check', () => {
            const result = buildTreeFromFlat(rows)
            expect(result).lengthOf(2)
            expect(result[0]).to.have.property('id', 1)
            expect(result[1]).to.have.property('id', 7)
            expect(result[0]).to.have.property('childrens').to.be.an('array').lengthOf(2)
            expect(result[1]).to.have.property('childrens').to.be.an('array').lengthOf(1)
            expect(result[1].childrens[0]).to.have.property('id', 8)
            expect(result[0].childrens[0]).to.have.property('id', 2)
            expect(result[0].childrens[1]).to.have.property('id', 3)
            expect(result[0].childrens[0].childrens).lengthOf(1)
            expect(result[0].childrens[0].childrens[0]).to.have.property('id', 4)
            expect(result[0].childrens[0].childrens[0].childrens).lengthOf(2)
            expect(result[0].childrens[0].childrens[0].childrens[0]).to.have.property('id', 5)
            expect(result[0].childrens[0].childrens[0].childrens[1]).to.have.property('id', 6)
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
        expect(result).lengthOf(2)
        expect(result[0]).to.have.property('id', 1)
        expect(result[1]).to.have.property('id', 7)
        expect(result[0]).to.have.property('childrens').to.be.an('array').lengthOf(2)
        expect(result[1]).to.have.property('childrens').to.be.an('array').lengthOf(1)
        expect(result[1].childrens[0]).to.have.property('id', 8)
        expect(result[0].childrens[0]).to.have.property('id', 2)
        expect(result[0].childrens[1]).to.have.property('id', 3)
        expect(result[0].childrens[0].childrens).lengthOf(1)
        expect(result[0].childrens[0].childrens[0]).to.have.property('id', 4)
        expect(result[0].childrens[0].childrens[0].childrens).lengthOf(2)
        expect(result[0].childrens[0].childrens[0].childrens[0]).to.have.property('id', 5)
        expect(result[0].childrens[0].childrens[0].childrens[1]).to.have.property('id', 6)
    })
})