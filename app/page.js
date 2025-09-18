'use client';

import Layout from "./component/layout";
import { useSession } from "next-auth/react";
export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="flex justify-between">
        <h2>Hello <b>{session?.user?.name}</b> </h2>
        <div className="bg-gray-300 p-1 px-2 rounded-lg hover:bg-gray-400 cursor-pointer">
            {session?.user?.name}
        </div>
      </div>
    </Layout>
  );

}
