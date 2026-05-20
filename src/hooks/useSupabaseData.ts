import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useSupabaseData<T extends { id: string }>(
  table: string,
  companyId: string | null
) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!companyId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data: rows, error } = await supabase
      .from(table)
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      setData([]);
    } else {
      setData(rows as T[]);
    }
    setIsLoading(false);
  }, [table, companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (item: Omit<T, 'id'>) => {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert({ ...item, company_id: companyId })
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }

    setData(prev => [inserted as T, ...prev]);
    return inserted as T;
  };

  const updateItem = async (id: string, updates: Partial<T>) => {
    const { data: updated, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error(`Error updating ${table}:`, error);
      return null;
    }

    setData(prev => prev.map(item => item.id === id ? (updated as T) : item));
    return updated as T;
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }

    setData(prev => prev.filter(item => item.id !== id));
    return true;
  };

  return {
    data,
    isLoading,
    refetch: fetchData,
    addItem,
    updateItem,
    deleteItem,
    setData,
  };
}
