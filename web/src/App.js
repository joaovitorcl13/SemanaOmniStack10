import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from './services/api';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';
import 'react-toastify/dist/ReactToastify.css';

import DevItem from './componets/Devitem';
import DevForm from './componets/DevForm';

function App() {

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    loadDevs();
  }, [])

  async function handleAddDev(data) {
    const response = await api.post("/devs", { data });
    
    if (!response.data.error) {

      setDevs([...devs, response.data]);

    } else {

      toast.error('Usuário já cadastrado ou não encontrado!');

    }
  }
  return (
    <div id="app">
      <ToastContainer />
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev._id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>

  );
}

export default App;
