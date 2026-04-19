"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { t } from '../lib/constants';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('TR');
  const [shops, setShops] = useState([]);
  const [globalAppointments, setGlobalAppointments] = useState([]);
  const [loggedInShop, setLoggedInShop] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('bookcy_lang');
    if (savedLang) setLang(savedLang);
    
    const session = localStorage.getItem('bookcy_biz_session');
    if(session) setLoggedInShop(JSON.parse(session));

    fetchData();
  }, []);

  async function fetchData() {
    const { data: sData } = await supabase.from('shops').select('*');
    if (sData) setShops(sData);

    const { data: aData } = await supabase.from('appointments').select('customer_phone');
    if (aData) setGlobalAppointments(aData);
  }

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('bookcy_lang', newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('bookcy_biz_session');
    setLoggedInShop(null);
  };

  return (
    <AppContext.Provider value={{ 
      lang, setLang: changeLang, t, 
      shops, globalAppointments, 
      loggedInShop, setLoggedInShop, handleLogout 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}