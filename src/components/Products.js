import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";

import { useSnackbar } from "notistack";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom } from "./Cart";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [prod, setProd] = useState([]);
  const [search, setSearch] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [showProduct, setShowProduct] = useState(true);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  let newUrl;
  let url = `${config.endpoint}/products`;
  const token = localStorage.getItem("token");
  //console.log(token);
  let performSearch = async (val) => {
    if (val === "") {
      setShowProduct(true);
      return;
    }

    try {
      // console.log(val);

      let res = await axios.get(`${url}/search?value=${val}`);
     // console.log(res.data);
      //setSearch(res.data)
      setShowProduct(false);
      setSearch(val);
      setFiltered(res.data);
      // console.log(res.data);

       return res.data
    } catch (e) {
      setShowProduct(false);
      if (e.response) {
        setFiltered([]);
        if (e.response.status === 400) {
          setSearch([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar("e.response.data.message", { variant: "error" });
          setSearch(prod);
        }
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const debounceSearch = (e, debounceTimeout) => {
    setSearch(e.target.value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    let newTimeout = setTimeout(() => {
      performSearch(e.target.value);
    }, 500);
    setDebounceTimeout(newTimeout);
  };

  let performAPICall = async () => {
    try {
      setLoading(true);
      const res = await axios.get(url); //.then((res)=>{
     // setProd(res.data);
      //  })
      //setProd(res.data)
    //  console.log(prod);
      setLoading(false);
      //new code
      //return res.data;
      // return res.data
      setProd(res.data)
    } catch (e) {
      setLoading(false);

      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        console.log("error check");
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      let res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     // setCart(res.data);
    // setItems(res.data)
      console.log(cart);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );

       
      }
      return null;
    }
  };
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty=0,
    stock,
    options = { preventDuplicate: false }
  ) => {
    // console.log("token", token)
    // console.log("items", items)
    // console.log("products", products)
    // console.log("id", productId)
    // console.log("qty", qty)
    // console.log("stock", stock)
    // console.log("items", items)

    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
    //generateCartItemsFrom(cart,prod)
    if (isItemInCart(items, productId) && options.preventDuplicate) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "warning",
        }
      );
      return;
    }

    try {
      let res = await axios.post(
        `${config.endpoint}/cart`,
        {
          productId:productId,
          qty:qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", 
          },
        }
      ); //.then((res)=>{
      if (res.status == 200) {
        updateCartItems(res.data, prod);
       // setItems(res.data)
      }
      //localStorage.setItem("cart-val",prod)
      // })
    } catch (e) {
      if (e.response && e.response.status == 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  const updateCartItems = (cartData, products) => {
    const cartItems = generateCartItemsFrom(cartData, products);
    setItems(cartItems);
  };
  const isItemInCart = (items, productId) => {
    if (items) {
      return items.findIndex((val) => val.productId === productId) !== -1;
    }
  };

  useEffect(() => {
    const onLoader = async () => {
       performAPICall();
     
    //  setProd(allProducts)
      //  fetchCart(token).then((cartData)=>{
        
      let cartData = await fetchCart(token);
      setCart(cartData);
      let cartDetails=await generateCartItemsFrom(cartData,prod)
     // setCart(cartItems)
      // setItems(cartDetails)
      
   //   console.log(prod);

      setItems(cartDetails)
     
    };
    onLoader();
  }, []);
  // useEffect(()=>{
  //   console.log("123")
  // },[items])

  return (
    <div>
      <Header hasHiddenAuthButtons>
        <TextField
          className="search-desktop"
          id="desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e)}
        />
      </Header>
      <TextField
        className="search-mobile"
        id="mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => debounceSearch(e)}
      />{" "}
      <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column" } }}>
        <Grid container>
          <Grid container className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>

            {loading ? (
              <Box className="loading">
                <CircularProgress />
                <h4> Loading Products... </h4>{" "}
              </Box>
            ) : showProduct ? (
              showProduct &&
              prod &&
              prod.map((produ) => {
                return (
                  <Grid md={3} xs={6} item>
                    <ProductCard
                      product={produ}
                      handleAddToCart={() => {
                        addToCart(
                          token,// adding allProducts from useEffect
                        //  generateCartItemsFrom(items, prod),
                           items,
                          prod,
                          produ._id,
                          1,
                          produ.stock,
                          {
                            preventDuplicate: true,
                          }
                        );
                      }}
                    />
                  </Grid>
                );
              })
            ) : filtered.length ? (
              filtered.map((prodi) => {
                //  setFilter(prod)
                return (
                  <Grid md={3} xs={6} item>
                    <ProductCard
                      product={prodi}
                      handleAddToCart={() => {
                        addToCart(
                          token,
                       // generateCartItemsFrom(items, prod),
                            items,
                          prod,
                          prodi._id,
                          1,
                          prodi.stock,
                          {
                            preventDuplicate: true,
                          }
                        );
                      }}
                    />
                  </Grid>
                );
              })
            ) : (
              <Box className="loading">
                <SentimentDissatisfied color="action" />
                <h4 style={{ color: "#636363" }}> No products found </h4>{" "}
              </Box>
            )}
          </Grid>
        </Grid>
        {token  ? (
          <Grid item md={12} xs={3} style={{backgroundColor:'#E9F5E1'}}>
            <Cart
              //generateCartItemsFrom()
              products={prod}
              //items={generateCartItemsFrom(cart, prod)}
              items={generateCartItemsFrom(items, prod)}
              handleQuantity={(products,prodId, updatedQty)=>addToCart(token, items, products,prodId, updatedQty, "", {preventDuplicate:false})}
            />
          </Grid>
        ) : null}
      </Box>
      <Footer />
    </div>
  );
};

export default Products;
