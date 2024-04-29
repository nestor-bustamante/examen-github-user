"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from 'next/image';

function GitHubUser() {
  
  const [username, setUsername] = useState<string>("");

  const userQuery = useQuery({
    queryKey: ['githubUser', username],
    queryFn: () => fetch(`https://api.github.com/users/${username}`).then(res => res.json()),
    enabled: false
  })

  const reposQuery = useQuery({
    queryKey: ['githubRepos', username],
    queryFn: () => fetch(`https://api.github.com/users/${username}/repos`).then(res => res.json()),
    enabled: false
  })

  const handleSearch = () => {
    if(username !== '') {
      userQuery.refetch();
      reposQuery.refetch();
    };
  };

  const listarRepos = () => {
    let repos = "";
    reposQuery.data.sort((x:any, y:any) => {
      const dateX:any = new Date(x.created_at);
      const dateY:any = new Date(y.created_at);
      return dateY - dateX;
    });

    for(let item of reposQuery.data){
      
      let repoDate = new Date(item.created_at);
      const myDate = `${ repoDate.getDay() }/${ repoDate.getMonth() }/${ repoDate.getFullYear() }`;
      repos += `
      <div class="py-2 border-b border-neutral-300 border-solid">
        <div><strong>${item.name}</strong></div>
        <div>${(item.description !== null) ? item.description : 'No tiene descripción'}</div>
        <div class="text-xs"><em>${myDate}</em></div>
      </div>
      `
    }

    return repos;

  }

  return (
    <div className="mx-auto w-full h-lvh max-w-xl">
      <div className="p-5 bg-white rounded-lg shadow-2xl my-4">
        <h1 className="mb-4 text-blue-700">Examen GitHub User</h1>
        <p><strong>Ingrese el nombre de usuario de GitHub</strong></p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingrese el nombre de usuario de GitHub"
          className="mt-4 border border-solid rounded outline-none border-blue-700 hover:border-blue-700 focus:border-blue-700 focus-visible:border-blue-700 focus-within:border-blue-700 w-full p-2"
        />
        <button className="bg-blue-700 focus:bg-blue-800 text-white py-2 px-4 rounded border-none mt-2" onClick={handleSearch}>Buscar</button>
      </div>
      { userQuery.isLoading && <p className="py-4">Cargando...</p> }
      { userQuery.error && <p>{userQuery.error.message}</p> }

      { userQuery.data?.id && (
        <div className="p-5 bg-white rounded-lg shadow-2xl my-4">

          <div className="grid grid-cols-[70px_auto] gap-1 py-2 border-b border-neutral-300 border-solid">
            <div className="auto-cols-min">
              <Image
                src={userQuery.data.avatar_url}
                alt={userQuery.data.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            </div>
            <div>
              <strong>{userQuery.data.name}</strong>
              <div>Seguidores: {userQuery.data.followers}</div>
            </div>
          </div>

          <div className="py-2 border-b border-neutral-300 border-solid">
            <h5>Biografía</h5>
            <p>{(userQuery.data.bio !== null) ? userQuery.data.bio : 'No tiene biografía'}</p>
          </div>

          <div className="pt-2">
            <div><h5 className="text-blue-700">Repositorios público ({reposQuery.data.length})</h5></div>
            <div className="product-des" dangerouslySetInnerHTML={{ __html: listarRepos() }}>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default GitHubUser;
