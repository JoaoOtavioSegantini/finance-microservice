import { Button, Typography } from '@material-ui/core';
import AddIcon from '@mui/icons-material/Add';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowsProp,
  GridToolbar,
} from '@mui/x-data-grid';
import { useKeycloak } from '@react-keycloak/ssr';
import { Head } from 'components/Head';
import { Page } from 'components/Page';
import { format, parseISO } from 'date-fns';
import { withAuth } from 'hof/withAuth';
import { useAuthSwr } from 'hooks/useAuthSwr';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import makeHttp from 'utils/http';
import { Transaction } from 'utils/model';
interface TransactionsPageProps {
  transactions: Transaction[];
}

const TransactionsPage: NextPage<TransactionsPageProps> = (props) => {
  const { initialized, keycloak } = useKeycloak();

  const router = useRouter();

  if (
    typeof window !== 'undefined' &&
    initialized &&
    !keycloak?.authenticated
  ) {
    router.replace(`/login?from=${window!.location.pathname}`);
    return null;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-unused-vars
  const { data, error } = useAuthSwr('transactions', {
    fallbackData: props.transactions,
  });

  const rows: GridRowsProp = (data as Transaction[]).map((transaction) => ({
    id: transaction.id,
    payment_date: transaction.payment_date,
    name: transaction.name,
    category: transaction.category,
    type: transaction.type,
    created_at: new Date(transaction.created_at).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium',
    }),
  }));

  const columns: GridColDef[] = [
    {
      field: 'payment_date',
      headerName: 'Data pag.',
      width: 100,
      renderCell: (params: GridRenderCellParams<string>) => (
        <strong>
          {format(parseISO(params?.value!.slice(0, 10)), 'dd/MM/yyyy')}
        </strong>
      ),
    },
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'category', headerName: 'Categoria', flex: 1 },
    { field: 'type', headerName: 'Operação', flex: 1 },
    { field: 'created_at', headerName: 'Criado em', flex: 1 },
  ];

  return keycloak?.authenticated && !!data ? (
    <Page>
      <Head title="Minhas transações" />
      <Box maxWidth="lg" style={{ margin: '10px auto' }}>
        <Typography
          component="h1"
          variant="h4"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          Minhas transações
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <Button
            startIcon={<AddIcon />}
            variant={'contained'}
            color="primary"
            style={{ marginBottom: '1rem' }}
            onClick={() => router.push('/transactions/new')}
          >
            Criar
          </Button>
        </Box>
        <Box sx={{ display: 'flex', height: 600 }}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            rowsPerPageOptions={[2, 20, 50, 100]}
            rows={rows}
            columns={columns}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
          />
        </Box>
      </Box>
    </Page>
  ) : null;
};

export default TransactionsPage;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps = withAuth(async (ctx, { token }) => {
  // const { data: transactions } = await makeHttp(token).get('transactions');

  return {
    props: {
      transactions: [],
    },
  };
});
