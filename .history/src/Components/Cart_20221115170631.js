
// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { db } from '../Config/Config';


// export const Cart = () => {
//   const [cart, setCart] = useState([])
//   const [products, setProducts] = useState([])
//   const getCart = async () => {
//     // const products = await db.collection('Product').get();
//     const products = await db.collection('cart').get();

//     const productArray = [];
//     for (var snap of products.docs) {
//         var data = snap.data();
//         data.ID = snap.id;

//         productArray.push({
//             ...data
//         })
//         if (productArray.length === products.docs.length) {
//             setProducts(productArray)


//         }

//     }

// }
// const navigate = useNavigate()
// useEffect(() => {
//     getCart();

// }, [])
// let Product;
//  return(
//  <div>
// <h1>Cart</h1>
// <div>
//   {
//     products.map((product, inx)=>{

//      console.log(product.ID);
// <div key={inx} >
//       <h5 >{product.price}</h5>
//       <h5 >{product.ID}</h5>
// </div>
//     })
//   }
// </div>

//  </div>
//  )
// }

import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { FaIgloo } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import fire, { auth, db } from '../Config/Config'

import { Products } from './Products'

export const Cart = () => {
    function GetUserUid() {
        const [uid, setUid] = useState(null);
        useEffect(() => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    setUid(user.uid);
                }
            })
        }, [])
        return uid;
    }
    const uid = GetUserUid();
    console.log(uid)
    function GetCurrentUser() {
        const [user, setUser] = useState(null)
        useEffect(() => {
            const unbn = onAuthStateChanged(auth, user => {
                if (user) {
                    fire.firestore().collection("user").doc(user.uid).get().then(snapshot => {
                        setUser(snapshot.data().FullName)
                    })
                } else {


                    setUser(null)
                }
            })
            return unbn
        }, [])
        return user;


    }
    const user = GetCurrentUser()
    const addCart = () => {
        console.log('Hello world')
    };
    // const [products, setProducts] = useState([])

    //   const getProduct = async () => {
    //       // const products = await db.collection('Product').get();
    //       const products = await db.collection('cart').get();

    //       const productArray = [];
    //       for (var snap of products.docs) {
    //           var data = snap.data();
    //           data.ID = snap.id;

    //           productArray.push({
    //               ...data
    //           })
    //           if (productArray.length === products.docs.length) {
    //               setProducts(productArray)


    //           }

    //       }

    //   }
    //   const navigate = useNavigate()
    //   useEffect(() => {
    //       getProduct();

    //   }, [])
    //   let Product;

    //   const addToCart = (product) => {
    //       if (uid !== null) {
    //           Product = product;
    //           Product['qty'] = 1;
    //           Product['TotalProductPrice'] = Product.qty * Product.price;
    //           db.collection("Cart" + uid).doc(product.ID).update(Product)
    //           console.log("Successfull Added to Cart")
    //       } else {
    //           navigate('login')
    //       }

    //   }

    //   const helloWorld = () => {
    //       console.log('Hello world')
    //   };
    //   const addCart = () => {
    //       console.log('Hello world')
    //   };
    //   const qty = CartProducts.map(cartProduct =>{
    //     return cartProduct.qty;
    //   })
    //   const reduceOfQty=(accumulator, currentValue)=>accumulator+currentValue;
    //   const totalQty= qty.reduce(reduceOfQty,0)

    //   const cartProductIncrease=(cartProduct)=>{
    //     Product = cartProduct;
    //     Product.qty= Product.qty+1
    //     //Product.TotalProductPrice= Product.qty*Product.price;
    // }
    //   const cartProductDecrease=(cartProduct)=>{
    //     Product = cartProduct;
    //     Product.qty= Product.qty-1
    //     //Product.TotalProductPrice= Product.qty*Product.price;
    //   }




    //state of the cart
    const [cartProducts, setCartProduct] = useState([])

    // getting cart product from the firestore collection and updating the state
    const cardProduct = []
    useEffect(() => {
        // auth.onAuthStateChanged(user=>{
        //     if(user){
        db.collection("cart").where('uid', '==', uid).onSnapshot(snapshort => {
            snapshort.forEach(newCart => {
                console.log(newCart.data())
                cardProduct.push(newCart.data())
            })

            // const newCartProduct = snapshort.doc.map((doc)=>({
            //     ID: doc.id,
            //     ...doc.data(),


            // }));

            // console.log(cardProduct)
            setCartProduct(cardProduct)

  }, [])
  let Product;

  const addToCart = (product) => {
      if (uid !== null) {
          Product = product;
          Product['qty'] = 1;
          Product['TotalProductPrice'] = Product.qty * Product.price;
          db.collection("Cart" + uid).doc(product.ID).update(Product)
          console.log("Successfull Added to Cart")
      } else {
          navigate('login')
      }

  }

  const helloWorld = () => {
      console.log('Hello world')
  };
  const addCart = () => {
      console.log('Hello world')
  };
  return (
    <div><h1>Cart</h1>
           <Products products={products} helloWorld={helloWorld} />
    </div>
  )
}
