import React, { useState, useEffect } from 'react'
import fire, { auth, db } from '../Config/Config';
import _, { size } from "underscore";
import { useLocation } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from "firebase/firestore";
import PaystackPop from '@paystack/inline-js'
import moment from 'moment';

export const OrderCart = () => {

  const [productOrder, setProductOrder] = useState([]);
  const [productOrderList, setProductOrderList] = useState([]);
  const [finalObj, setFinalObj] = useState("");
  const [products, setProducts] = useState({});


  // const addCart = (id) => {
  //   // navigate('/cart');
  //   db.collection("completeOrder")
  //     .doc(finalObj.colour + '_' + finalObj.size + '_' + finalObj.productCode).set({ ...finalObj, ...{ uid: uid } }).then(() => {
  //       console.log('Finished!!')
  //     })

  //   // console.log("Hi", finalObj);
  // }
  // timestamp: serverTimestamp()





  const [completeOrder, setCompleteOrder]= useState([])
  const [orders, setOrders] = useState([]
    )

  const [userDetails, setUserDetails] = useState({});
  const location = useLocation();
  console.log('Loca: ', location.state)
  // const amount= useState(location.state)

  // console.log(this.props.location.state)
  function GetUserUid() {
    const [uid, setUid] = useState(null);
    console.log('My complete order data:=>', completeOrder)
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if (user) {
          setUid(user.uid);
          db.collection('user').doc(user.uid).collection('completedOrders').get().then(rres => {
            rres.forEach(element => {
              setCompleteOrder( element.data())
              setOrders(element.data().cartProducts[0])
              // console.log('Elementary=> ', element.data().createdAt)
              console.log('Elementary:<> ', element.data().cartProducts)
            
            });
          });
        }
      })
    }, [])
    return uid;
  }
  const uid = GetUserUid();
  console.log(uid)
  function GetCurrentUser() {
    useEffect(() => {
      const unbn = onAuthStateChanged(auth, userAuth => {
        if (userAuth) {
          fire.firestore().collection("user").doc(userAuth.uid).get().then(snapshot => {
            console.log(snapshot.data())
            setUserDetails(snapshot.data())
          })

        } else {


          // setUser(null)
        }
      })
      return unbn
    }, [])
  }
  GetCurrentUser()

  // db.collection("completeOrder")
  //   .doc(finalObj.colour + '_' + finalObj.size + '_' + finalObj.productCode).set({ ...finalObj, ...{ uid: uid } }).then(() => {
  //     console.log('Finished!!')
  //   })
  
  



  useEffect(() => {
    auth.signInWithEmailAndPassword('kat1@gmail.com', '12345678').then(() => {
      console.log('Done!')
    }).catch(er => {
      console.log(er.message);
    })

    // console.log('uid: ', uid)
    // db
    //   .collection("user")
    //   .doc('0pCc5XQRfYMSFpRbBxJsBPNXJgs1')
    //   .collection("completeOrder")
    //   .get().then(res => {
    //     res.forEach(element => {
    //       console.log(element.id)
    //     })
    //   }).catch(er => {
    //     console.log('error: ', er.message);
    //   })

    // productOrder.then((res) => {
    //   res.forEach((element) => {
    //     console.log("Element: ", element.data());
    //     completeOrder.push(element.data());
    //   });
    //   // setProductOrderList(completeOrder);
    //   // var mySubArray = _.uniq(completeOrder, "completeOrders");
    //   // console.log("Element: ", mySubArray);
    //   // setProductOrder(mySubArray);
    const products = db
  .collection("completedOrders")
  .doc()
  .get();
products.then((res) => {
  console.log('12 order data here=>',res.data());
  setProducts(res.data());
});
    // });
  }, []);
  console.log("33 order here=>", products)
  return (
    <div><h2>OrderCart</h2>
    <span>
    <span><img src={orders.image} height={100} alt='product-image' /></span> 
    <div>
    <p><h4>Reference Number:</h4> {completeOrder.referenceNumber}</p>
    {/* <p>Order Date: {completeOrder.cartProducts}</p>  */}
    {console.log('orders=> ',{orders})}
    <p><h4>Brand Category:</h4> {orders.brandCategory}</p>
    <p><h4>Product Colour:</h4> {orders.colour}</p>
   <p><h4>Total price:</h4> R{orders.price}</p>
  <p><h4>Product Description:</h4> {orders.prodDescription}</p>
  <p><h4>Product Name:</h4> {orders.prodName}</p>
  <p><h4>Product Type:</h4> {orders.prodType}</p>
  <p><h4>Product Code:</h4> {orders.productCode}</p>
  <p><h4>Quantity:</h4> {orders.qty}</p>
  <h4>Size:</h4>
  <p> {orders.size}</p>
  <p><h4>Order Date:</h4> {moment().format('MMMM Do YYYY, h:mm:ss a')}</p>
  </div>
    </span>
   
    </div>
  )
}
