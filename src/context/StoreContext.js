import React, { createContext, useState, useContext } from 'react';

const StoreContext = createContext({});

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadMockProducts = () => {
    const mockProducts = [
      {
        id: 'prod001',
        name: 'Hamburguesa Clásica',
        description: 'Carne, lechuga, tomate, queso',
        price: 8.5,
        category: 'hamburguesas',
        image: '🍔',
        isAvailable: true,
        preparationTime: 15,
      },
      {
        id: 'prod002',
        name: 'Papas Fritas',
        description: 'Papas fritas crujientes',
        price: 3.5,
        category: 'acompañantes',
        image: '🍟',
        isAvailable: true,
        preparationTime: 10,
      },
      {
        id: 'prod003',
        name: 'Refresco',
        description: 'Bebida fría 500ml',
        price: 2.0,
        category: 'bebidas',
        image: '🥤',
        isAvailable: true,
        preparationTime: 2,
      },
      {
        id: 'prod004',
        name: 'Pizza Pepperoni',
        description: 'Pizza grande con pepperoni',
        price: 12.0,
        category: 'pizzas',
        image: '🍕',
        isAvailable: true,
        preparationTime: 20,
      },
      {
        id: 'prod005',
        name: 'Tacos al Pastor',
        description: '3 tacos con carne al pastor',
        price: 5.0,
        category: 'mexicana',
        image: '🌮',
        isAvailable: true,
        preparationTime: 12,
      },
      {
        id: 'prod006',
        name: 'Sushi Roll',
        description: 'Roll de salmón y aguacate',
        price: 15.0,
        category: 'sushi',
        image: '🍱',
        isAvailable: false,
        preparationTime: 25,
      },
      {
        id: 'prod007',
        name: 'Ensalada César',
        description: 'Lechuga, pollo, crutones',
        price: 10.0,
        category: 'ensaladas',
        image: '🥗',
        isAvailable: true,
        preparationTime: 10,
      },
    ];
    
    setProducts(mockProducts);
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: `prod${Date.now()}`,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (productId, updates) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, ...updates }
          : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prevProducts =>
      prevProducts.filter(product => product.id !== productId)
    );
  };

  const toggleProductAvailability = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, isAvailable: !product.isAvailable }
          : product
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        loadMockProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
