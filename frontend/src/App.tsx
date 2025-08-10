import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import Personlize from './pages/Personalize';
import CartPage from './pages/CartPage';
import { Toaster } from 'sonner';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'products':
        return <ProductsPage />;
      case 'cart':
        return <CartPage onPageChange={setCurrentPage}/>;
      case 'personalize':
        return <Personlize />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;