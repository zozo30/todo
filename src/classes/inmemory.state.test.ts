import { expect } from 'chai'
import { after } from 'mocha'
import InMemoryState from './inmemoryState'

describe('InMemoryState', () => {
    before((done) => {
        InMemoryState.registerCollection('test')

        InMemoryState.commitDb().then((writeOk) => {
            if (!writeOk)
                return done('Commit DB not working!')
            done()
        })
    })

    after((done) => {
        InMemoryState.setCollection('test', [])
        InMemoryState.commitDb().then((writeOk) => {
            if (!writeOk)
                return done('Commit DB not working!')
            done()
        })
    })

    it('saveAndRead', async () => {
        InMemoryState.setCollection('test', [{ id: 'test item' }])
        await InMemoryState.commitDb()
        await InMemoryState.readDb()
        const tests = InMemoryState.getCollection('test')
        expect(tests).to.be.an('array')
        expect(tests).to.have.deep.members([{ id: 'test item' }])
    })

})