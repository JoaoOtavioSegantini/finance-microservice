import { Typography, Box, Paper } from '@mui/material';
import { useKeycloak } from '@react-keycloak/ssr';
import TransactionForm from 'components/Forms/TransactionForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import makeHttp from 'utils/http';
import { Head } from '../../components/Head';
import { Page } from '../../components/Page';

const TransactionsNewPage: NextPage = () => {
  const router = useRouter();
  const { initialized, keycloak } = useKeycloak();

  if (
    typeof window !== 'undefined' &&
    initialized &&
    !keycloak?.authenticated
  ) {
    router.replace(`/login?from=${window!.location.pathname}`);
    return null;
  }

  async function onSubmit(data: any) {
    try {
      await makeHttp().post('transactions', data);
      router.push('/transactions');
    } catch (e) {
      console.error(e);
    }
  }
  return keycloak?.authenticated ? (
    <Page>
      <Head title="Nova transação" />
      <Box marginX={30} marginY={10}>
        <Paper>
          <Box p={2}>
            <Box mb={2}>
              <Typography component="h1" variant="h4">
                Nova transação
              </Typography>
            </Box>
          </Box>
          <TransactionForm onSubmit={onSubmit} />
        </Paper>
      </Box>
    </Page>
  ) : null;
};

export default TransactionsNewPage;
