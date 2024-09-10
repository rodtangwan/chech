import config from "../config";

const baseUrl = config.baseUrl;

export const fetchWithState = async (url, options) => {
  const loadingState = { loading: true, error: null, data: null };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || "An error occurred";
      throw new Error(errorMessage);
    }

    // Return the success state
    return { ...loadingState, loading: false, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { ...loadingState, loading: false, error: error.message };
  }
};

export const addToCart = async (id, quantity, shipping, color_id) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity, shipping, color_id }),
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/addToCart/${id}`, requestOptions);
};

export const useCoupon = async code => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/useCoupon`, requestOptions);
};

export const addShippingDetails = async (
  country,
  state,
  city,
  street,
  zipcode,
  firstname,
  lastname,
  phone
) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country,
      state,
      city,
      street,
      zipcode,
      firstname,
      lastname,
      phone
    }),
    credentials: "include"
  };

  try {
    const response = await fetch(`${baseUrl}/shippingAddress`, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

export const viewProduct = async id => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  try {
    const response = await fetch(`${baseUrl}/product/${id}`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      throw Error(data.error);
    }
    return data;
  } catch (err) {
    return err;
  }
};

export const viewCategory = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/categories`, requestOptions);
};

export const viewOrder = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/orders`, requestOptions);
};

export const viewCategoryProducts = async category => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/products/${category}`, requestOptions);
};

export const viewProductDescription = async id => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/product_desc/${id}`, requestOptions);
};

export const viewProductColors = async id => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/view_product_color/${id}`, requestOptions);
};

export const updateCartItemColor = async (productId, color) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ color })
  };

  const response = await fetch(
    `${baseUrl}/updateColor/${productId}`,
    requestOptions
  );
  return response.json();
};

export const shipment = async productId => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  const response = await fetch(`${baseUrl}/shipment/${productId}`, requestOptions);
  return response.json();
};

export const viewReview = async id => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/reviews/${id}`, requestOptions);
};

export const getCart = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  try {
    const response = await fetch(`${baseUrl}/cart`, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      throw Error(data.error);
    }
    return data;
  } catch (err) {
    return err;
  }
};

export const clearCart = async () => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  const response = await fetch(`${baseUrl}/clearCart`, requestOptions);
  return response.json();
};

export const removeFromCart = async productId => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  const response = await fetch(
    `${baseUrl}/removeFromCart/${productId}`,
    requestOptions
  );
  return response.json();
};

export const handleQuantity = async (productId, quantity) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
    credentials: "include"
  };

  const response = await fetch(
    `${baseUrl}/updateQuantity/${productId}`,
    requestOptions
  );
  return response.json();
};

export const inputQuantity = async (productId, input) => {
  const quantity = input;

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
    credentials: "include"
  };

  const response = await fetch(
    `${baseUrl}/updateQuantity/${productId}`,
    requestOptions
  );
  return response.json();
};

export const getShipping = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  const response = await fetch(`${baseUrl}/shipping`, requestOptions);
  return response.json();
};

export const getShippingAddress = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/shippingAddress`, requestOptions);
};

export const assignShipping = async productId => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  const response = await fetch(
    `${baseUrl}/assignShipping/${productId}`,
    requestOptions
  );
  return response.json();
};

export const checkout = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/checkout`, requestOptions);
};

export const proceed = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/proceed`, requestOptions);
};

export const payment = async method => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(method)
  };

  return fetchWithState(`${baseUrl}/paymentMethods`, requestOptions);
};

export const pay = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/pay`, requestOptions);
};

export const confirmation = async () => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };

  return fetchWithState(`${baseUrl}/confirmation`, requestOptions);
};
