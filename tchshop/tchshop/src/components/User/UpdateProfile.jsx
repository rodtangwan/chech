import { useState, useEffect } from "react";
import { getShippingAddress, addShippingDetails } from "../../services/userApi";
import axios from "axios";

const UpdateProfile = () => {
  const [deliveryForm, setDeliveryForm] = useState({
    country: "",
    state: "",
    city: "",
    street: "",
    zipcode: "",
    firstname: "",
    lastname: "",
    phone: ""
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [shipData, setShipData] = useState(false);

  console.log(shippingAddress);

  useEffect(() => {
    const fetchShippingAddress = async () => {
      const { data, error } = await getShippingAddress();
      console.log(data);
      if (data.error) {
        setShippingAddress(null);
      } else {
        setShippingAddress(data.shipping_address);
        setShipData(true);
      }
    };

    fetchShippingAddress();
  }, []);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryData = response.data.map(country => ({
          name: country.name.common,
          code: country.cca2
        }));

        // Sort countries alphabetically
        const sortedCountries = countryData.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states when the country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (deliveryForm.country) {
        try {
          const response = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/states",
            { country: deliveryForm.country }
          );
          setStates(response.data.data.states || []);
          setCities([]); // Reset cities when country changes
        } catch (error) {
          console.error("Failed to fetch states:", error);
        }
      }
    };

    fetchStates();
  }, [deliveryForm.country]);

  // Fetch cities when the state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (deliveryForm.state) {
        try {
          const response = await axios.post(
            "https://countriesnow.space/api/v0.1/countries/state/cities",
            {
              country: deliveryForm.country,
              state: deliveryForm.state
            }
          );
          setCities(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch cities:", error);
        }
      }
    };

    fetchCities();
  }, [deliveryForm.state]);

  // Validate form field
  const validateForm = () => {
    let formErrors = {};

    if (!deliveryForm.phone) formErrors.phone = "Phone is required";
    if (!deliveryForm.lastname) formErrors.street = "Lastname is required";
    if (!deliveryForm.firstname) formErrors.street = "Firstname is required";
    if (!deliveryForm.street) formErrors.street = "Street address is required";
    if (!deliveryForm.country) formErrors.country = "Country is required";
    if (!deliveryForm.state) formErrors.state = "State is required";
    if (!deliveryForm.city) formErrors.city = "City is required";
    if (!deliveryForm.zipcode || !/^\d{3,6}$/.test(deliveryForm.zipcode))
      formErrors.zipcode = "Valid zip code is required (3-6 digits)";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setDeliveryForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleDelivery = async () => {
    if (!validateForm()) {
      return; // Exit if form is not valid
    }

    setLoading(true);
    try {
      const result = await addShippingDetails(
        deliveryForm.country,
        deliveryForm.state,
        deliveryForm.city,
        deliveryForm.street,
        deliveryForm.zipcode,
        deliveryForm.firstname,
        deliveryForm.lastname,
        deliveryForm.phone
      );
      if (result.status === "success") {
        setShipData(true);
      }

      // Clear form after successful submission
      setDeliveryForm({
        country: "",
        state: "",
        city: "",
        street: "",
        zipcode: "",
        firstname: "",
        lastname: "",
        phone: ""
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to add shipping details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-8 ">
      {shipData ? (
        <div className="flex items-center justify-between py-2 border-b">
          <span className="font-semibold">Address:</span>
          <span>{shippingAddress}</span>
          <button onClick={() => setShipData(false)}>
            Edit Shipping Details
          </button>
        </div>
      ) : (
        <div>
            <button  onClick={() => setShipData(true)}>
            Close Shipping Details
          </button>
         
        <section className="mx-auto mb-8 w-80">
      <legend className="mb-2 text-xs font-semibold">Enter shipping address where product will be delivered.</legend>

      <select
        name="country"
        value={deliveryForm.country}
        onChange={handleChange}
        className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      >
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country.code} value={country.name}>
            {country.name}
          </option>
        ))}
      </select>
      {errors.country && <p className="text-red-500">{errors.country}</p>}

      <select
        name="state"
        value={deliveryForm.state}
        onChange={handleChange}
        className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      >
        <option value="">Select State</option>
        {states.map(state => (
          <option key={state.name} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>
      {errors.state && <p className="text-red-500">{errors.state}</p>}

      <select
        name="city"
        value={deliveryForm.city}
        onChange={handleChange}
        className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      >
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {errors.city && <p className="text-red-500">{errors.city}</p>}

      <div className="mb-2">
        <input
          name="street"
          type="text"
          placeholder="Street Address"
          value={deliveryForm.street}
          onChange={handleChange}
          className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
        {errors.street && <p className="text-red-500">{errors.street}</p>}
      </div>

      <div className="mb-2">
        <input
          name="zipcode"
          type="text"
          placeholder="Zip Code"
          value={deliveryForm.zipcode}
          onChange={handleChange}
          className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
        {errors.zipcode && <p className="text-red-500">{errors.zipcode}</p>}
      </div>

      <div className="mb-2">
        <input
          name="lastname"
          type="text"
          placeholder="lastname"
          value={deliveryForm.lastname}
          onChange={handleChange}
          className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
        {errors.lastname && <p className="text-red-500">{errors.lastname}</p>}
      </div>

      <div className="mb-2">
        <input
          name="firstname"
          type="text"
          placeholder="firstname"
          value={deliveryForm.firstname}
          onChange={handleChange}
          className="relative block w-full px-3 py-2 my-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        />
        {errors.zipcode && <p className="text-red-500">{errors.firstname}</p>}
      </div>

      <div>
      <button
        type="button"
        onClick={handleDelivery}
       className="relative flex justify-center px-4 py-2 mx-auto text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md w-44 group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>
      </div>
    </section>
        </div>
      )}
    </section>
  );
};

export default UpdateProfile;
