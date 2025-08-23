import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';

export default function Home() {
  // const { loading, data, error } = useQuery(QUERY_ME);
  const [updateUser, { error, data }] = useMutation(UPDATE_USER);

  // if (error) console.error("QUERY_ME error:", error);

  // const userInfo = data?.me;

  // console.log(userInfo);

  const updateUserCommits = async () => {
    try {
      const data = await updateUser();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

  }

  return (
    <div>
      <a href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/github/callback&scope=read:user user:email`}>
        <button>Login with GitHub</button>
      </a>
      <button onClick={updateUserCommits}></button>
      {/* {loading ? (
        <div>Loading...</div>
      ) : userInfo ? (
        <div>Welcome {userInfo.username}!</div>
      ) : (
        <div>Not logged in</div>
      )} */}
    </div>
  );
}
