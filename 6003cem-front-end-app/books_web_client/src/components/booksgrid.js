import React from 'react';
import { Col, Row } from 'antd';
import BookCard from './bookcard';
import { status, json } from "../utilities/requestHandlers";

class BooksGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }

  componentDidMount() {
    fetch("https://analogcontact-handgabriel-3000.codio-box.uk/api/v1/books")
    .then(status)
    .then(json)
    .then(data => {
      this.setState({ books: data })
    })
    .catch(err => console.log("Error when getting books.",err))
  }

  render() {
    if (!this.state.books.length) {
      return <h3>Loading...</h3>
    }
    const cardList = this.state.books.map(book => {
      return (
        <div style={{padding:"10px"}} key={book.ID}>
          <Col span={6}>
            <BookCard {...book} />  
          </Col>
        </div>
      )
    });
    return (
      <Row type="flex" justify="space-around">
        {cardList}
      </Row>
    );
  }
}

export default BooksGrid;
