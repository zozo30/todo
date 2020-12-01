import { init } from './init'
import InMemoryState from './classes/inmemoryState'

(async () => {
    await InMemoryState.registerCollection('todos')
    const server = await init()
})()