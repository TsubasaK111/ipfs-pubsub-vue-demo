const IPFS = require('ipfs');
const Room = require('ipfs-pubsub-room');
const { Buffer } = require('buffer');
const config = require('./config');

const ipfs = new IPFS({ ...config.ipfs });

console.log(Room);

ipfs.once('ready', () => {
  ipfs.id((err, info) => {
    if (err) throw err;
    console.log('IPFS node ready with address ', info.id);
  });

  const room = Room(ipfs, 'ipfs-pbsub-demo');
  console.log(room);

  room.on('subscribed', () => {
    console.log('now connected to room!');

    setInterval(() => {
      console.log("broadcasting...");
      room.broadcast("supz");
    }, 4000);
  });

  room.on("peer joined", (peer) => {
    console.log('peer with address', peer, "joined");
    room.sendTo(peer, "sup" + peer + "!");
    ipfs.files.add( ipfs.types.Buffer.from("'testtesttest"), (err, files) => {
      console.log(files);
      room.sendTo(peer, files);
    });
  });

  room.on("peer left", (peer) => {
    console.log('peer with address', peer, "left")
  });

  room.on("message", message => {
    console.log('got message from', message.from, ":", message.data.toString());
  });
});

// TODO: send files from peer to peer
// TODO: make simple interface to ad-hoc send messages/files to each other.

import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    title: "photo viewer 2000",
    photos: [],
    currentView: "AllPhotos",
    selectedPhoto: null,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    gohome(state) {
      console.log("vuex gohome");
      state.currentView = "AllPhotos";
    },
    singlePhoto(state, photo) {
      state.currentView = "SinglePhoto";
      state.selectedPhoto = photo;
    },
  },
});

new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});
