import React from 'react';
import { useParams } from 'react-router-dom';

function Account(props) {
  let { id } = useParams();  
  return (
    <>
      <h1>Account ID: {id}</h1>
      <p>This is where individual accounts can be displayed</p>
    </>
  );
}

export default Account;