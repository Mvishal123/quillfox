import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/trpc/index';
 
export const trpc = createTRPCReact<AppRouter>({
    
});