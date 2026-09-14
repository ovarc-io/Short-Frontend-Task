import OrderDetails from '@/portals/admin/order-details';
import Orders from '@/portals/admin/orders';
import ShippingCalendar from '@/portals/admin/shipping-calendar';
import { SnackbarProvider } from '@/shared/contexts/snackbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './index.css';

// Lists are re-visited constantly; don't refetch them on every navigation.
const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<SnackbarProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<Navigate to='/orders' replace />} />
						<Route path='/orders' element={<Orders />} />
						<Route path='/orders/calendar' element={<ShippingCalendar />} />
						<Route path='/orders/:public_id' element={<OrderDetails />} />
					</Routes>
				</BrowserRouter>
			</SnackbarProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</StrictMode>,
);
