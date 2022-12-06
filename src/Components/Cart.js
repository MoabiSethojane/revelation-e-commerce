


import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { FaIgloo } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import fire, { auth, db } from '../Config/Config'
import { CartProduct } from './CartProduct'
import { Navbar } from './Navbar'
import { PayStack } from './PayStack'
import { Link } from 'react-router-dom'

import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import { RiDeleteBin5Line } from 'react-icons/ri'
import { Products } from './Products'
import { doc, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore'
import PaystackPop from '@paystack/inline-js'

import moment from 'moment';
export const Cart = () => {
    const navigate = useNavigate();

    var purchaseDate = new Date();
 moment(purchaseDate).format('MMMM Do YYYY, h:mm:ss a')
 console.log("purchase date=>",purchaseDate)

    const [userObj, setUserObj] = useState({})

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
        useEffect(() => {
            const unbn = onAuthStateChanged(auth, user => {
                if (user) {
                    fire.firestore().collection("user").doc(user.uid).get().then(snapshot => {
                        setUserObj(snapshot.data())
                    })
                } else {
                    setUserObj(null)
                }
            })
            return unbn
        }, [])
        return userObj;


    }
    const user = GetCurrentUser()
    const addCart = () => {
        console.log('Hello world')
    };




    //state of the cart
    const [cartProducts, setCartProduct] = useState([])

    // getting cart product from the firestore collection and updating the state
    const cardProduct = []
    useEffect(() => {
        // auth.onAuthStateChanged(user=>{
        //     if(user){
        db.collection("cart").where('uid', '==', uid).onSnapshot(snapshort => {
            snapshort.forEach(newCart => {
                console.log({ ...newCart.data(), ...{ id: newCart.id } })
                cardProduct.push({ ...newCart.data(), ...{ id: newCart.id } })
            })


            setCartProduct(cardProduct)

        })
        //     }else{
        //         console.log("user is not signed in to retive cart")
        //     }
        // })
        console.log(cardProduct)
    }, [])



    const paywithpaystack = (e) => {
        // e.preventDefault()
        // console.log("current amount ", amount)
        const paystack = new PaystackPop()
        paystack.newTransaction({
            key: "pk_test_145aacfe44042ba956a6f2039dda1dd7477f95a3",
            amount: overallAmount * 100,
            email: userObj.Email,
            firstName: userObj.FullName,
            lastName: userObj.FullName,
            onSuccess(transaction) {
                let message = `Payment Complete! Reference ${transaction.reference}`
                alert(message);

                db.collection('user').doc(uid).collection('completedOrders').doc(transaction.reference).set({
                    prodList: cartProducts,
                    referenceNumber: transaction.reference,
                    createdAt: serverTimestamp(),
                }).then(() => {
                    // db.collection("cart").where('uid', '==', uid).onSnapshot(snapshort => {
                    //     snapshort.forEach(element => {
                    //         element.ref.delete().then(() => {
                    //             console.log('Item Deleted');
                    //         }).catch(er => {
                    //             console.log(er.message);
                    //         })
                    //     })
                    // })
                });
            },
            onCancel() {
                alert("Transaction Canceled")
            }
        })
        // alert("Successful payment")

    }


    // const [products, setProducts] = useState([])

    // const getProduct = async () => {
    //     // const products = await db.collection('Product').get();
    //     const products = await db.collection('cart').get();

    //     // const productArray = [];
    //     for (var snap of cardProduct.docs) {
    //         var data = snap.data();
    //         data.ID = snap.id;

    //         cartProducts.push({
    //             ...data
    //         })
    //         if (cartProducts.length === cartProducts.docs.length) {
    //             setProducts(cartProducts)


    //         }

    //     }

    // }
    // console.log(cardProduct)
    // const qty = cartProducts.map(cartProduct =>{
    // return cartProduct.qty
    // })
    // const reduceOfQty =(accumulator, currntValue)=>accumulator+currntValue;
    // // const totalQty =qty.reduce(reduceOfQty,0)
    // const price = cartProducts.map((cartProduct)=>{
    // return cartProduct.TotalProductPrice
    // })
    // const reduceOfPrice =(accumulator, currntValue)=>accumulator+ currntValue;
    // const totalPrice = price.reduce(reduceOfPrice,0);
    // let Product ;
    // const cartProductIncrease=(cardProduct)=>{
    //     Product = cardProduct;
    //     Product.qty=Product.qty+1;
    //     Product.TotalProductPrice = Product.qty*Product.price;
    //     auth.onAuthStateChanged(user=>{
    //         if(user){
    //             db.collection('cart'+ user.uid).doc(cardProduct.ID).update(Product).then(()=>{
    //                 console.log("Increment!!")
    //             })
    //         }else{
    //             console.log("user is not logged in to increament")
    //         }
    //     })
    // }
    // const cartProductDecrease=(cardProduct)=>{
    //     Product = cardProduct;
    //     if(Product.qty>1)
    //     Product.qty=Product.qty-1;
    //     Product.TotalProductPrice = Product.qty*Product.price;
    //     auth.onAuthStateChanged(user=>{
    //         if(user){
    //             db.collection('cart'+ user.uid).doc(cardProduct.ID).update(Product).then(()=>{
    //                 console.log("Decrement!!")
    //             })
    //         }else{
    //             console.log("user is not logged in to increament")
    //         }
    //     })
    // }
    //   return (
    //     <>
    //     <Navbar user={user}/>
    //     {cardProduct.length>0 &&(
    //         <div className='container-fluid'>
    //         <h1 className='text-center'>Cart</h1>
    //         <div className='products-box'>

    //             {/* <CartProducts cardProduct={cardProduct}
    //                 cartProductIncrease={cartProductIncrease}
    //                 cartProductDecrease={cartProductDecrease}
    //             /> */}
    //         </div>

    //         <div className='summery-box'>
    //         <h5>Cart Summary</h5>
    //         <br></br>
    //         <div>
    //             Total No of Product:<span>{totalQty}</span>
    //         </div>
    //         <div>
    //             Total Price to Pay:<span>R{totalPrice}</span>
    //         </div>
    //         </div>
    //         </div>
    //     )
    //     }

    //     {cardProduct.length<1 &&(
    //         <div className='container-fluid'>No Products to show</div>


    //     )
    //     }
    //            {/* <Products products={products} helloWorld={helloWorld} /> */}
    //     </>
    //   )
    let getPrice = [];
    const checkOut = (overallAmount, prodList) => {
        console.log('prodList: ', prodList);
        navigate('/paystack', { state: { total: overallAmount, prodList: prodList } });
    }
    const handleDecrease = async (res) => {
        const cartQtyRef = doc(db, "cart", res.id);
        await updateDoc(cartQtyRef, {
            qty: increment(-1),
        }).then(() => {
            db.collection("cart").doc(res.id).get().then(async (snapshort) => {
                console.log('hello', snapshort.data())
                await updateDoc(cartQtyRef, {
                    total: parseFloat(snapshort.data().qty) * parseFloat(snapshort.data().price)
                }).then(() => {
                    console.log('Increment done!')
                });
            }).catch(er => {
                console.log(er.message)
            });
        });
    }


    const handleIncrement = async (res) => {

        const cartQtyRef = doc(db, "cart", res.id);
        await updateDoc(cartQtyRef, {
            qty: increment(1),
        }).then(() => {
            db.collection("cart").doc(res.id).get().then(async (snapshort) => {
                console.log('hello', snapshort.data())
                await updateDoc(cartQtyRef, {
                    total: parseFloat(snapshort.data().qty) * parseFloat(snapshort.data().price)
                }).then(() => {
                    console.log('Increment done!')
                });
            }).catch(er => {
                console.log(er.message)
            });
        });
    }
    const handleDelete = (res) => {
        db.collection('cart').doc(res.id).delete().then(() => {
            console.log("document deleted=>", res.id)
        })
    }

    let overallAmount = 0;
    let quantity = 1;

    return (
        <>Cart

            <div>
                {cartProducts.map(res => {

                    if (res.price) {
                        overallAmount = overallAmount + (parseFloat(res.price) * parseFloat(res.qty));
                        console.log('chek', overallAmount)
                    }
                    if (res.qty > 1) {
                        quantity = (parseFloat(res.qty))
                        console.log("Current Quantity here:", quantity)
                    }


                    //     const getTotalAmount=()=>{
                    //      let getAmount = res.price;
                    //      let getQty = res.qty;
                    //      let totalPrice = getAmount*getQty
                    //      console.log("this is the total ",totalPrice)
                    //      return {totalPrice};



                    //     }
                    //    console.log(getTotalAmount())

                    return (
                        <div style={{ background: 'blue', margin: 8, color: 'whitesmoke' }}>
                            <img src={res.image} height={100} alt='product-image' />
                            <p>Brand Category: {res.brandCategory}</p>
                            <p>Product  Type:{res.prodType}</p>
                            <p>Product Name{res.prodName}</p>
                            <p>product Description: {res.prodDescription}</p>
                            <p>product Price: R{res.price}</p>
                            <p>Total Amount: R{res.price * res.qty}</p>
                            <p>product Colour:{res.colour}</p>
                            <p>Product Size:{res.size}</p>
                            <p ><button onClick={(v) => handleDecrease(res)} style={{ background: 'red' }}><FaMinusCircle size={20} /></button>Quantity:{res.qty}<button onClick={(v) => handleIncrement(res)} style={{ background: 'green' }}>
                                <FaPlusCircle size={20} /></button>
                                <button onClick={(v) => handleDelete(res)} style={{ background: 'red' }}><RiDeleteBin5Line size={20} /></button></p>
                            <p>Product code:{res.productCode}</p>



                        </div>

                    )
                })}
                <p>Customer Name: {userObj.FullName}</p>
                <p>Amount to pay : R {overallAmount}</p>
                <button onClick={() => paywithpaystack(overallAmount, cartProducts)}>Checkout</button>

                {/* <Link to={{
                    pathname: `/paystack`,
                    state: {amount: 'amount'}
                }} >Checkout </Link> */}
                {/* <h4><Link to={`/paystack:${'hello'}`}>Checkout</Link></h4> */}

                {/* <h4><Link to={`/paystack`}>Checkout</Link></h4>   */}

            </div>
            {/* */}
        </>
    )
}
