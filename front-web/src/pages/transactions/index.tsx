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
import { Button, Container, Typography } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { withAuth } from 'hof/withAuth';
import { GetServerSidePropsContext, NextPage } from 'next';
import { Token, validateAuth } from 'utils/auth';
import makeHttp from 'utils/http';
import { Transaction } from 'utils/model';

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
  return (
    <Container>
      <Typography component="h1" variant="h4">
        Minhas transações
      </Typography>
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
    </Container>
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
