import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
    
  const response = await axios.post("/auth/login", {"username": email, "password": password}, {
  headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }});

  localStorage.setItem('token', response.data.access_token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data.user;
};

export const register = async (username: string, email: string, password: string, latitude: number, longitude: number) => {
  await axios.post("/auth/register", {"username": username, "email": email, "password": password, "longitude": longitude, "latitude": latitude});
  return true;
}

export const logout = async () => {
  const token = localStorage.getItem('token');
  await axios.post("/auth/logout", null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const fetchAllProducts = async (query: string) => {
  try{
    const res = await axios.post("/products", {query: query});
    return res.data.products;
  }catch(err){
    console.log("Error while fetching products - " , err);
    return [];
  }
};

export const fetchProductsWithFilter = async (filters: any) => {
  const res = await axios.post("/products/filter", filters);
  return res.data.products;
};

export const sendEvent = async (product_id: string, category: string, eventType: string) => {
  const user = localStorage.getItem('user');
  const payload = {"product_id": product_id, "event_type": eventType, "user_id": "", "category": category}
  if(user) {
    const userDetails = JSON.parse(user);
    payload["user_id"] = userDetails.email
  }
  
  try{
    await axios.post("/events", payload);
  }catch(err){
    console.log(err);
  }
};

export const fetchFeaturedDeals = async () => {
  try{
    const token = localStorage.getItem('token');
    const res = await axios.get("/products/near-by", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return res.data.products;
  }catch(err){
    console.log("Error while fetching featured deals - " , err);
    return [];
  }
};


export const getRecommendations = async () => {
  try{
    const token = localStorage.getItem('token');
    const res = await axios.get("/recommendations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    return res.data.products;
  }catch(err){
    console.log("Error while fetching recommendations - " , err);
    return [];
  }
};

// add trending products