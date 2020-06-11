import React, { Fragment } from 'react';
import { RouteComponentProps } from '@reach/router';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Loading, Header } from '../components';
import { CartItem, BookTrips } from "../containers";
interface CartProps extends RouteComponentProps {

}

export const GET_CART_ITEMS = gql`

  query GetCartItems {
    cartItems @client
  }

`


const Cart: React.FC<CartProps> = () => {
  
  const { data, loading, error } = useQuery(GET_CART_ITEMS)
  if(loading) return <Loading />
if(error) return <p>Error : {error.message}</p> 
  if(!data) return <p data-test-id="empty message">Not Found</p>

  return (
    <Fragment>
      <Header>
        MY CART
      </Header>
      {!data || (!!data && data.cartItems.length===0) ? 
  (<p data-test-id = "empty message">No items in your cart</p> ) : (
    <Fragment>
      {!!data && data.cartItems.map((launchId : any) => (
        <CartItem key = {launchId} launchId = {launchId} />
      ) )}
      <BookTrips cartItems = {!!data ? data.cartItems : []} />
      </Fragment>
  ) }
    </Fragment>
  )
  //return <div />;
}

export default Cart;
