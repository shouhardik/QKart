import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";
import  { useEffect, useState } from "react";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *  
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */

export const generateCartItemsFrom = (cartData, productsData) => {
 
  if (!cartData) return
  const nCart = cartData.map((val) => ({
    ...val,
    ...productsData.find((product) => val.productId === product._id)
  }))
  console.log(nCart)
  //localStorage.setItem("Cart",JSON.stringify(nCart))
  return nCart
 
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */

export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0
  let total = 0
  let filterItems = items.filter((item) => item.qty)
  let individualItemCost = filterItems.map((item) => {
    return (item.qty * item.cost)
  });
  let totalCartValue = individualItemCost.reduce((acc, curr) => curr + acc, 0);
  return totalCartValue; 
};

export const getTotalItems=(items=[])=>{
  if(!items) return 0;

  const total=items.map((val)=>val.qty).reduce((acc,curr)=>acc+curr)
  return total
}


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */

const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly ,
 // hasCheckButton
  
}) => {
  
  const [quant,setQuant]=useState(value)
  return (
    <div>
      {
         isReadOnly
          ?
          (
            <Box>
            Qty:{quant}</Box>
  
            ) : (
              <Stack direction="row" alignItems="center">
            
    <IconButton size="small" color="primary" onClick={() => {setQuant(quant-1);
      handleDelete()}}>
      <RemoveOutlined />
    </IconButton>
    <Box padding="0.5rem" data-testid="item-qty">
      {quant}
    </Box>
    <IconButton size="small" color="primary" onClick={() =>{ setQuant(quant+1);
    handleAdd()}}>
      <AddOutlined />
    </IconButton>
  </Stack>
              )
      }
    </div>
    
  );
};

/**                             
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */

    const Cart = ({
    products,

    items = [],
    handleQuantity,
    isReadOnly=false
    //hasCheckButton=false

    }) => {
    
    const token = localStorage.getItem("token")
    console.log(token)
    const history = useHistory()
    const routeToCheckout=()=>{
      history.push("/checkout")
    }
    //if(items.length!==0) return
    if (!items.length) {
      return (
        <Box className="cart empty">
          <ShoppingCartOutlined className="empty-cart-icon" />
          <Box color="#aaa" textAlign="center">
            Cart is empty. Add more items to the cart to checkout.

          </Box>
        </Box>
      );
    }


    return (
      <>
        <Box className="cart">
          {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
          {console.log("hi")}
          { items.map((val) => (
            
            <Box key={val.productId}>
              {/* {val.qty > 0 ? ( */}


                <Box display="flex" alignItems="flex-start" padding="1rem">
                  <Box className="image-container">
                    <img
                      // Add product image
                      src={val.image}
                      // Add product name as alt eext
                      alt={val.name}

                      width="100%"
                      height="100%"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="6rem"
                    paddingX="1rem"
                  >
                    <div>{val.name}</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <ItemQuantity
                        // Add required props by checking implementation
                        handleAdd={()=>{
                          handleQuantity(
                            products,
                            val.productId,
                            val.qty+1,
                            


                            //console.log(token),console.log(val.qty)
                          )
                          }
                          
                        }

                        handleDelete={() =>{
                          handleQuantity(
                            products,
                            val.productId,
                            val.qty-1
                          )
                        }
                        }

                        value={val.qty}
                        isReadOnly={isReadOnly}


                      />
                      <Box padding="0.5rem" fontWeight="700">
                        ${val.cost}
                      </Box>
                    </Box>

                  </Box>
                </Box>
              {/* ) : (null)} */}
            </Box>
          ))}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >

            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          {isReadOnly!==true&&(
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
             onClick={routeToCheckout}
            >
              Checkout
            </Button>
          </Box>
          )
        }
        </Box>
        {isReadOnly && (
        <Box className="cart" padding="1rem">
          <h2>Order Details</h2>
          <Box className="cart-row">
            <p>Products</p>
            <p>{getTotalItems(items)}</p>
          </Box>
          <Box className="cart-row">
            <p>Subtotal</p>
            <p>${getTotalCartValue(items)}</p>
          </Box>
          <Box className="cart-row">
            <p>Shipping Charges</p>
            <p>$0</p>
          </Box>
          <Box className="cart-row" fontSize="1.25rem" fontWeight="700">
            <p>Total</p>
            <p>${getTotalCartValue(items)}</p>
          </Box>
        </Box>
      )}
      </>
    )
    };

    export default Cart;
