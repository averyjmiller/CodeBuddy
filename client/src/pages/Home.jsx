export default function Home() {
  return (
    <div>
      <a href={`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/github/callback&scope=read:user user:email`}>
        <button>Login with GitHub</button>
      </a>
    </div>
  );
}
