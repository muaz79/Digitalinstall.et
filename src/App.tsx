import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { NotificationProvider } from './context/NotificationContext.js';
import { Header } from './components/layout/Header.js';
import { Footer } from './components/layout/Footer.js';
import { ToastContainer } from './components/layout/ToastContainer.js';
import { QuickRoleSwitcher } from './components/layout/QuickRoleSwitcher.js';
import { QuoteRequestModal } from './components/public/QuoteRequestModal.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { ServiceDetailPage } from './pages/ServiceDetailPage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CartPage } from './pages/CartPage.js';
import { ProjectsPage } from './pages/ProjectsPage.js';
import { WarrantyPage } from './pages/WarrantyPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { CustomerPortalPage } from './pages/CustomerPortalPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { AuthPage } from './pages/AuthPage.js';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quotePrefillService, setQuotePrefillService] = useState<string | undefined>(undefined);

  // Synchronize browser history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuoteModal = (serviceSlug?: string) => {
    setQuotePrefillService(serviceSlug);
    setQuoteModalOpen(true);
  };

  // Route matching
  const renderRoute = () => {
    // Exact routes
    if (currentPath === '/' || currentPath === '/home') {
      return <HomePage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/services') {
      return <ServicesPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/shop') {
      return <ShopPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath.startsWith('/shop/')) {
      const idOrSlug = currentPath.replace('/shop/', '');
      return <ProductDetailPage idOrSlug={idOrSlug} navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/cart') {
      return <CartPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/projects') {
      return <ProjectsPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/warranty-support' || currentPath === '/warranty') {
      return <WarrantyPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/account' || currentPath === '/portal') {
      return <CustomerPortalPage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
    }
    if (currentPath === '/admin') {
      return <AdminDashboardPage navigate={navigate} />;
    }
    if (currentPath === '/login' || currentPath === '/auth') {
      return <AuthPage navigate={navigate} />;
    }

    // Default Fallback to HomePage
    return <HomePage navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] text-[#0B1320] antialiased selection:bg-[#1F6FEB] selection:text-white">
      <Header
        currentPath={currentPath}
        navigate={navigate}
        onOpenQuoteModal={handleOpenQuoteModal}
      />

      <main className="flex-1">
        {renderRoute()}
      </main>

      <Footer navigate={navigate} onOpenQuoteModal={handleOpenQuoteModal} />

      <QuickRoleSwitcher navigate={navigate} />
      <ToastContainer />

      <QuoteRequestModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        initialService={quotePrefillService}
        navigate={navigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
