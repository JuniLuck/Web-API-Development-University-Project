import React from "react";

import UserContext from "../contexts/user";
import { Card } from "antd";
import PostIcon from "./listicons";
import propTypes from "prop-types";
const { Meta } = Card;



class BookCard extends React.Component { 
    static contextType = UserContext;
    render() {
        return (
            <Card
              style = {{ width: 150, height: 200 }}
              cover = {<img src = {this.props.bookCoverURL}
                        alt="book cover"
                        height={200}/>}
              hoverable
              actions = {[ 
                <PostIcon type = "cart" stateLink = {this.props.links.cart} bookID = {this.props.ID}/>,
                <PostIcon type = "wish" stateLink = {this.props.links.wishlist} bookID = {this.props.ID}/>
                ]}
              onClick={this.goToBook()}
              >
                    <Meta title = {this.props.bookTitle} description = {this.props.blurb} />
            </Card>
        );
    }

    goToBook() {
        console.log(this.props.ID);
    }
}

BookCard.propTypes = {
    ID: propTypes.number,
//    inCart: propTypes.bool,
//    inWishlist: propTypes.bool,
    bookTitle: propTypes.string,
    authorID: propTypes.string,
    bookCoverURL: propTypes.string
    }


export default BookCard;