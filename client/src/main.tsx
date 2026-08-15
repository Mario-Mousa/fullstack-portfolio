import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import superjson from "superjson";
import App from "./App";
import "./i18n";
import "./index.css";
import { trpc } from "./lib/trpc";

function TrpcApp() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({
    links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
    </trpc.Provider>
  );
}

createRoot(document.getElementById("root")!).render(<TrpcApp />);
