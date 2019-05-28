export const state = () => ({
  decks: {}
})

export const mutations = {
  saveDeck (state, { id, deck }) {
    if (!id || !deck) {
      return
    }
    state.decks = Object.assign({}, state.decks, { [id]: deck })
  }
}
