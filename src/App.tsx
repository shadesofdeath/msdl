import React, { useState, useEffect, useRef } from 'react';
import { SearchBar } from './components/SearchBar';
import { ProductList } from './components/ProductList';
import { BackButton } from './components/BackButton';
import { useProducts } from './hooks/useProducts';
import { generateUUID, checkSharedSession } from './utils/session';
import { API_URL, LANGS_URL, DOWN_URL, SESSION_URL, SHARED_SESSION_GUID } from './api/constants';

function App() {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const [sessionId, setSessionId] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sharedSession, setSharedSession] = useState(false);
  const [shouldUseSharedSession, setShouldUseSharedSession] = useState(true);
  const [msContent, setMsContent] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const currentSkuIdRef = useRef<string>('');

  useEffect(() => {
    setSessionId(generateUUID());
    checkSharedSession(API_URL).then(shouldUse => {
      setShouldUseSharedSession(shouldUse);
    });
  }, []);

  useEffect(() => {
    if (!formRef.current) return;

    const submitButton = formRef.current.querySelector('#submit-sku');
    const languageSelect = formRef.current.querySelector('#product-languages');

    if (submitButton && languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        const select = e.target as HTMLSelectElement;
        if (select.value) {
          (submitButton as HTMLButtonElement).disabled = false;
        } else {
          (submitButton as HTMLButtonElement).disabled = true;
        }
      });

      submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        const select = languageSelect as HTMLSelectElement;
        if (select.value) {
          const selectedOption = select.options[select.selectedIndex];
          const skuId = JSON.parse(selectedOption.value).id;
          currentSkuIdRef.current = skuId;
          getDownload(skuId);
        }
      });
    }
  }, [msContent]);

  const getLanguages = async (productId: string) => {
    setLoading(true);
    setError('');
    const currentSessionId = sharedSession ? SHARED_SESSION_GUID : sessionId;
    
    try {
      const response = await fetch(`${LANGS_URL}&productEditionId=${productId}&sessionId=${currentSessionId}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const html = await response.text();
      if (html.includes('errorModalMessage')) {
        throw new Error('Error fetching languages');
      }
      
      setMsContent(html);
    } catch (err) {
      setError('Failed to fetch languages. Please try again.');
      console.error('Error fetching languages:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFromServer = async (productId: string, skuId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}proxy?product_id=${productId}&sku_id=${skuId}`);
      if (!response.ok) {
        throw new Error('Server proxy failed');
      }
      const html = await response.text();
      setMsContent(html);
    } catch (err) {
      setError('All download methods failed. Please try again later.');
      console.error('Server proxy error:', err);
    } finally {
      setLoading(false);
    }
  };

  const retryWithSharedSession = async (skuId: string) => {
    setSharedSession(true);
    setLoading(true);
    try {
      const response = await fetch(`${DOWN_URL}&skuId=${skuId}&sessionId=${SHARED_SESSION_GUID}`);
      if (!response.ok) {
        throw new Error('Shared session failed');
      }
      const html = await response.text();
      if (html.includes('errorModalMessage')) {
        throw new Error('Shared session error');
      }
      setMsContent(html);
    } catch (err) {
      console.error('Shared session error:', err);
      if (selectedProduct) {
        await getFromServer(selectedProduct, skuId);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDownload = async (skuId: string) => {
    setLoading(true);
    setError('');

    try {
      // Method 1: Try with current session
      const response = await fetch(`${DOWN_URL}&skuId=${skuId}&sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Normal session failed');
      }

      const html = await response.text();
      if (html.includes('errorModalMessage')) {
        // Method 2: Try with shared session
        if (shouldUseSharedSession) {
          await retryWithSharedSession(skuId);
          return;
        }
        throw new Error('Normal session error');
      }

      setMsContent(html);

      // Register successful session
      if (!sharedSession) {
        await Promise.all([
          fetch(SESSION_URL + SHARED_SESSION_GUID),
          fetch(SESSION_URL + "de40cb69-50a5-415e-a0e8-3cf1eed1b7cd"),
          fetch(API_URL + 'add_session?session_id=' + sessionId)
        ]);
      }
    } catch (err) {
      console.error('Download error:', err);
      // Method 3: Try server proxy if both direct methods fail
      if (selectedProduct) {
        await getFromServer(selectedProduct, skuId);
      }
    }
  };

  const handleProductSelect = async (id: string) => {
    setSelectedProduct(id);
    try {
      const response = await fetch(SESSION_URL + sessionId);
      if (!response.ok) {
        getLanguages(id);
      }
    } catch {
      getLanguages(id);
    }
  };

  const filteredProducts = Object.entries(products).filter(([_, name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Windows ISO Download</h1>

        {!selectedProduct ? (
          <>
            <SearchBar value={search} onChange={setSearch} />
            {productsLoading ? (
              <div className="text-center">Loading products...</div>
            ) : productsError ? (
              <div className="text-red-500">{productsError}</div>
            ) : (
              <ProductList products={filteredProducts} onSelect={handleProductSelect} />
            )}
          </>
        ) : (
          <div>
            <BackButton onClick={() => setSelectedProduct(null)} />
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div 
                ref={formRef}
                className="bg-gray-800 p-6 rounded-lg"
                dangerouslySetInnerHTML={{ __html: msContent }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;