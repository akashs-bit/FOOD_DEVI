import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const PlaceOrder = async (event) => {
    event.preventDefault();

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        if (paymentMethod === "stripe") {
          window.location.replace(response.data.session_url);
        } else {
          toast.success("Order placed");
          navigate("/myorders");
        }
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong while placing the order.");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={PlaceOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={onChangeHandler}
            value={data.firstName}
          />
          <input
            required
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={onChangeHandler}
            value={data.lastName}
          />
        </div>
        <input
          required
          name="email"
          type="text"
          placeholder="Email address"
          onChange={onChangeHandler}
          value={data.email}
        />
        <input
          required
          name="street"
          type="text"
          placeholder="Street"
          onChange={onChangeHandler}
          value={data.street}
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            type="text"
            placeholder="City"
            onChange={onChangeHandler}
            value={data.city}
          />
          <input
            required
            name="state"
            type="text"
            placeholder="State"
            onChange={onChangeHandler}
            value={data.state}
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipCode"
            type="text"
            placeholder="Zip Code"
            onChange={onChangeHandler}
            value={data.zipCode}
          />
          <input
            required
            name="country"
            type="text"
            placeholder="Country"
            onChange={onChangeHandler}
            value={data.country}
          />
        </div>
        <input
          required
          name="phone"
          type="text"
          placeholder="Phone"
          onChange={onChangeHandler}
          value={data.phone}
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <div>
            <h2>Cart Total</h2>
            <div className="cart-total-details">
              <p>Sub Total</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fees</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          <div className="custom-payment-method">
            <h3>Payment Method</h3>
            <label
              className={`payment-option ${
                paymentMethod === "cod" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              COD ( Cash on delivery )
            </label>

            <label
              className={`payment-option ${
                paymentMethod === "stripe" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Stripe ( Credit / Debit )
            </label>
          </div>

          <button type="submit">Place Order</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
