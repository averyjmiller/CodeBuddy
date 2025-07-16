import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GITHUB_LOGIN } from '../utils/mutations';

export default function GitHubCallback() {
  const [githubLogin] = useMutation(GITHUB_LOGIN);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      githubLogin({ variables: { code } })
        .then(({ data }) => {
          const token = data.githubLogin.token;
          localStorage.setItem('id_token', token);
          navigate('/');
        })
        .catch(err => {
          console.error('GitHub login failed:', err);
        });
    }
  }, [githubLogin, searchParams, navigate]);

  return <p>Logging in with GitHub...</p>;
}
