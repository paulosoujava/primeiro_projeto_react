import React, {useState, useEffect, FormEvent} from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoIm from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';
import api from '../../service/api';

// shif + alt + F
interface Repository {
  full_name: string;
  description: string;
  owner: {
   login: string;
   avatar_url: string;
  };
}
const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [newRep, setNewRep ] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(()=>{
     const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');
     if(storageRepositories){
       return JSON.parse(storageRepositories);
     }else{
       return [];
     }
  });
  useEffect(()=> {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories));
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
    event.preventDefault();
    if( !newRep){
      setInputError('Digite o autor/nome do repositório');
      return;
    }
    try{
      const response = await api.get<Repository>(`repos/${newRep}`);
      const repository = response.data
      setRepositories([ ...repositories, repository]);
      setNewRep('');
      setInputError('');
    }catch(err){
      setInputError("ops erro ao tentar buscar");
    }

  }

  return (
    <>
      <img src={logoIm} alt="Github Explorer" />
      <Title> Explore repositórios no Github </Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
        value={newRep}
        onChange={e=> setNewRep(e.target.value)}
         placeholder="Digite o nome do repositório" />
        <button type="submit"> Pesquisar </button>
      </Form>
      {inputError && <Error>{inputError}</Error>}

      <Repositories>
      {repositories.map(r => (
          <Link key={r.full_name} to={`/repository/${r.full_name}`}>
          <img src={r.owner.avatar_url} alt={r.owner.avatar_url} />
          <div>
            <strong>{r.owner.login}</strong>
            <p>{r.description}</p>
          </div>
          <FiChevronRight size={20}/>
        </Link>
      ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
