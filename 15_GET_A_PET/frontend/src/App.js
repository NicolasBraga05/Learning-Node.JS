import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

/* components */
import Navbar from './components/layouts/Navbar'
import Footer from './components/layouts/Footer'
import Container from './components/layouts/Container'
import Message from './components/layouts/Message';


/* pages */
import Login from './components/pages/Auth/Login'
import Register from './components/pages/Auth/Register';
import Home from './components/pages/Home'
import Profile from './components/pages/User/Profile'
import MyPets from './components/pages/Pets/MyPets';
import AddPet from './components/pages/Pets/AddPet';
import EditPet from './components/pages/Pets/EditPets';
import PetDetails from './components/pages/Pets/PetDetails';



/* context */
import { UserProvider } from './context/UserContext';



function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Message />
        <Container>
          <Routes>
            {/* Definindo a rota para o login */}
            <Route path='/login' element={<Login />} />
            
            {/* Definindo a rota para o registro */}
            <Route path='/register' element={<Register />} />

            {/* Definindo a rota para o perfil */}
            <Route path='/user/profile' element={<Profile />} />

            {/* Definindo uma rota para os pets */}
            <Route path='/pets/mypets' element={<MyPets />} />

            {/* Definindo uma rota para criar os pets */}
            <Route path='/pets/create' element={<AddPet />} />

            {/* Definindo uma rota para editar os pets */}
            <Route path='/pets/edit/:id' element={<EditPet />} />

            {/* Definindo a rota para detalhe dos pets */}
            <Route path='/pets/:id' element={<PetDetails />} />
              
            {/* Definindo a rota para a página inicial */}
            <Route path='/' element={<Home />} />
          </Routes>
        </Container>
        <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;


