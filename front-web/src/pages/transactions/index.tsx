import {
  Column,
  IntegratedFiltering,
  IntegratedPaging,
  PagingState,
  SearchState,
  SortingState,
} from '@devexpress/dx-react-grid';
import {
  Table,
  Grid,
  TableHeaderRow,
  Toolbar,
  SearchPanel,
  PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';
import { Button, Typography } from '@material-ui/core';
import { Head } from 'components/Head';
import { Page } from 'components/Page';
import { format, parseISO } from 'date-fns';
import { withAuth } from 'hof/withAuth';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import makeHttp from 'utils/http';
import { Transaction } from 'utils/model';
import AddIcon from '@mui/icons-material/Add';

interface TransactionsPageProps {
  transactions: Transaction[];
}

const columns: Column[] = [
  {
    name: 'payment_date',
    title: 'Data pag.',
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), 'dd/MM/yyyy');
    },
  },
  {
    name: 'name',
    title: 'Nome',
  },
  {
    name: 'category',
    title: 'Categoria',
  },
  {
    name: 'type',
    title: 'Operação',
  },
  {
    name: 'created_at',
    title: 'Criado em',
    getCellValue: (row: any, columnName: string) => {
      return format(parseISO(row[columnName].slice(0, 10)), 'dd/MM/yyyy');
    },
  },
];

const TransactionsPage: NextPage<TransactionsPageProps> = (props) => {
  const router = useRouter();
  return (
    <Page>
      <Head title="Minhas transações" />
      <Typography component="h1" variant="h4">
        Minhas transações
      </Typography>
      <Button
        startIcon={<AddIcon />}
        variant={'contained'}
        color="primary"
        onClick={() => router.push('/transactions/new')}
      >
        Criar
      </Button>
      <Grid rows={props.transactions} columns={columns}>
        <Table />
        <SortingState
          defaultSorting={[{ columnName: 'created_at', direction: 'desc' }]}
        />
        <SearchState defaultValue="Conta de luz" />
        <PagingState defaultCurrentPage={0} pageSize={5} />
        <TableHeaderRow showSortingControls />
        <IntegratedFiltering />
        <Toolbar />
        <SearchPanel />
        <PagingPanel />
        <IntegratedPaging />
      </Grid>
    </Page>
  );
};

export default TransactionsPage;

export const getServerSideProps = withAuth(async (ctx, { token }) => {
  const { data: transactions } = await makeHttp(token).get('transactions');

  return {
    props: {
      transactions,
    },
  };
});
