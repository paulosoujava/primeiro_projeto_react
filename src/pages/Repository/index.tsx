import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import logoIm from '../../assets/logo.svg';
import { Header, RepositoryInfo,Issues } from  './style';
import { FiChevronsLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../service/api';

interface RepositoryParams{
  repository: string;
}
interface Repository{
 full_name: string;
 description: string;
 stargazers_count: number;
 forks_count: number;
 open_issues_count: number;
 owner: {
   avatar_url: string;
 };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  }
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const { params } = useRouteMatch<RepositoryParams>();
  useEffect(() => {
    api.get(`repos/${params.repository}`).then( (rep) => {
        setRepository(rep.data);
    });
    api.get(`repos/${params.repository}/issues`).then( (iss) => {
      setIssues(iss.data);
  });
  // async function loadData(): Promise<void>{
  //   const [repository, issues] = await Promise.all([
  //     api.get(`repos/${params.repository}`),
  //     api.get(`repos/${params.repository}/issues`),
  //   ]);
  // }
  // loadData();
  }, [params.repository]);
return(
  <>
    <Header>
      <img src={logoIm} alt="Github Explorer" />
      <Link to="/">
        <FiChevronsLeft size="16px"/>
        Voltar
    </Link>
    </Header>
    {repository && (
        < RepositoryInfo>
          <header>
            <img src={repository.owner.avatar_url} alt={repository.full_name} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
        <li>
          <strong>{repository.stargazers_count}</strong>
          <span>Stars</span>
        </li>
        <li>
          <strong>{repository.forks_count}</strong>
          <span>Forks</span>
        </li>
        <li>
          <strong>{repository.open_issues_count} </strong>
          <span>Issues Abertas</span>
        </li>
      </ul>
      </RepositoryInfo>
    )}

    <Issues>
      {issues.map(issue => (
        <a key={issue.id} href={issue.html_url}>
          <div>
          <strong>{issue.title}</strong>
            <p>{issue.user.login}</p>
          </div>
          <FiChevronRight size={20}/>
        </a>
      ))}

    </Issues>
  </>
  );
};

export default Repository;
