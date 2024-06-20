import React from 'react';
import { useParams } from 'react-router-dom';

function Book(props) {
  let { id } = useParams();  
  return (
    <>
      <h1>Post ID: {id}</h1>
      <p>This is where individual article posts can be displayed</p>
    </>
  );
}

export default Book;
