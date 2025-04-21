import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Dashboard({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [operationTypes, setOperationTypes] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [operationTypeId, setOperationTypeId] = useState('');

  useEffect(() => {
    fetchTransactions();
    fetchOperationTypes();
  }, []);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        operationType(name)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setTransactions(data);
  };

  const fetchOperationTypes = async () => {
    const { data, error } = await supabase
      .from('operationType')
      .select('*');

    if (error) console.error(error);
    else setOperationTypes(data);
  };

  const addTransaction = async () => {
    if (!amount || !description || !operationTypeId) {
      alert('Please fill all fields');
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .insert([{
        user_id: user.id,
        amount: parseFloat(amount),
        description,
        operationType_id: operationTypeId,
        date
      }]);

    if (error) alert(error.message);
    else {
      setAmount('');
      setDescription('');
      setOperationTypeId('');
      fetchTransactions();
    }
  };

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      <button onClick={() => supabase.auth.signOut()}>Выйти</button>

      <div>
        <h2>Добавить операцию</h2>
        <input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={operationTypeId}
          onChange={(e) => setOperationTypeId(e.target.value)}
        >
          {operationTypes.map((obj) => (
            <option key={obj.id} value={obj.id}>{obj.name}</option>
          ))}
        </select>
        <input
          type='date'
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addTransaction}>Добавить</button>
      </div>

      <h2>Операции</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.amount} - {t.description} ({t.operationType?.name}, {t.date})
          </li>
        ))}
      </ul>
    </div>
  );
}