import IPFS from 'ipfs'
import OrbitDB from 'orbit-db'

const createOrbitDBVuexPlugin = async function (ipfsConfig) {
  this.config = ipfsConfig;

  const ipfs = new IPFS({ ...ipfsConfig });
  console.log('Installing OrbitDB ...')

  function createDB() {
    new Promise((resolve, reject) => {
      ipfs.on('error', e => reject(e))
      ipfs.on('ready', async () => {
        // Create a database
        const orbitdb = new OrbitDB(ipfs)

        const db = await orbitdb.keyvalue('broampSharedStore')

        console.log(db)
        resolve(db)
      })
    })
  }

  try {
    const db = await createDB();
    console.log(db);
    return (store) => {
      //   db.events.on('whatever', () => {
      //  ... add recievers here
      store.subscribe(mutation => {
        switch (mutation.type) {
          case ('broadcastAudioSrc'):
            console.log('broadcastAudioSrc subs');
            console.log(mutation.payload);
            return;
          case ('broadcastAudioStatus'):
            console.log('broadcastAudioStatus subs');
            return;
          case ('broadcastPlay'):
            console.log('broadcastPlay subs');
            return;
          case ('broadcastPause'):
            console.log('broadcastPause subs');
            return;
          default:
            // do nothing.
        }
      });
    }
    console.log('OrbitDB installed ...')

    // return {
    //   get(query) {
    //     return db.get(query);
    //   },
    //   put(doc) {
    //     return db.put(doc);
    //   },
    //   onReplicated: async (callback) => {
    //     return db.events.on('replicated', callback)
    //   },
    // }
  } catch (e) {
    console.log(e, 'Error installing orbit-db plugin...')
  }
}

module.exports = { createOrbitDBVuexPlugin };
