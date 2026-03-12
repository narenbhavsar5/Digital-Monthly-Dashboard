import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider, client } from './graphql/client';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DataEntry from './pages/DataEntry';
import RegionManagement from './pages/RegionManagement';
import UserProfile from './pages/UserProfile';
import './index.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-entry" element={<DataEntry />} />
              <Route path="/regions" element={<RegionManagement />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
