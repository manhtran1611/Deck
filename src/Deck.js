import React, { Component } from "react";
import Card from "./Card";
import axios from "axios";
import "./Deck.css";
const API_BASE_URL = "https://www.deckofcardsapi.com/api/deck/";
class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = { deck: null, drawn: [] };
    this.getCard = this.getCard.bind(this);
  }
  async getCard() {
    let id = this.state.deck.deck_id;
    try {
      let cardURL = `${API_BASE_URL}${id}/draw/`;
      let cardRes = await axios.get(cardURL);
      if (!cardRes.data.success) {
        throw new Error("No card remaining");
      }
      let card = cardRes.data.cards[0];
      this.setState((st) => ({
        drawn: [
          ...st.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`,
          },
        ],
      }));
    } catch (error) {
      alert(error);
    }
  }

  async componentDidMount() {
    let deck = await axios.get(`${API_BASE_URL}new/shuffle/?deck_count=1`);
    this.setState({ deck: deck.data });
  }

  render() {
    const cards = this.state.drawn.map((c) => (
      <Card key={c.id} name={c.name} image={c.image} />
    ));
    return (
      <div>
        <h1>Card Dealer</h1>

        <button onClick={this.getCard}>Get Card!</button>
        <div className="Deck-area">{cards}</div>
      </div>
    );
  }
}

export default Deck;
