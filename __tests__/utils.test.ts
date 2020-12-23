import { infoToProjection } from '../src/utils/graphql'
import { FieldNode, SelectionSetNode } from 'graphql'
import { expect } from 'chai'

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

describe('utils', () => {
    describe('infoToProjection', () => {
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
})