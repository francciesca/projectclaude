import { useState, useEffect } from 'react';
import { Company } from '../types';

const COMPANIES: Company[] = [
  { id: '1', name: 'Cabal' },
  { id: '2', name: 'TransFleet SA' },
  { id: '3', name: 'Logística Norte' }
];

export function useCompany() {
  const [currentCompany, setCurrentCompany] = useState<Company>(COMPANIES[0]);
  const [companies] = useState<Company[]>(COMPANIES);

  useEffect(() => {
    const savedCompany = localStorage.getItem('currentCompany');
    if (savedCompany) {
      const company = JSON.parse(savedCompany);
      setCurrentCompany(company);
    }
  }, []);

  const changeCompany = (company: Company) => {
    setCurrentCompany(company);
    localStorage.setItem('currentCompany', JSON.stringify(company));
  };

  return {
    currentCompany,
    companies,
    changeCompany
  };
}