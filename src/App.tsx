import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { MainPage } from './pages/Main/MainPage';
import ProductPage from './pages/Product/ProductPage';
import { Product } from './TypeDeclaration';
import axios, { AxiosResponse } from 'axios';

export const ProductsContext = createContext<Product[]>([]);

export const App = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get<Product[]>(`${process.env.REACT_APP_API_URL}product`)
      .then((res: AxiosResponse) => {
        setProducts(res?.data)
      })
      .catch((error) => {
        console.log("error :" + error.toJSON())
        console.log("error :" + error.message)
      })
  }, []);

  return (
    <>
      <ProductsContext.Provider value={products}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/product" element={<ProductPage />} />
          </Routes>
        </BrowserRouter>
      </ProductsContext.Provider>
    </>
  );
}

export default App;